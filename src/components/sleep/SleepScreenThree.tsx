import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { buildPiscesGeometry } from './sleepScreenGeometry'
import {
  createLinesMaterials,
  createPiscesStarMaterial,
  createStarShaderMaterial,
} from './sleepScreenShaders'
import {
  chooseQuality,
  getPreset,
  makeFpsLoop,
  runMicroBenchmark,
} from './sleepScreenUtils'
import type { Preset } from './sleepScreenUtils'

// Premium help text animation keyframes
const fadeKeyframes = `
@keyframes sleepHelpFade {
  0% { opacity: 0.65; }
  10% { opacity: 0.82; }
  50% { opacity: 0.92; }
  90% { opacity: 0.82; }
  100% { opacity: 0.65; }
}`

const BLOOM_LAYER = 1

export default function SleepScreenThree({ onWake }: { onWake?: () => void }) {
  const { t } = useTranslation()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  // Inject keyframes once (must be inside component for hooks)
  useEffect(() => {
    if (!document.getElementById('sleep-help-fade-keyframes')) {
      const style = document.createElement('style')
      style.id = 'sleep-help-fade-keyframes'
      style.innerHTML = fadeKeyframes
      document.head.appendChild(style)
    }
  }, [])

  const wake = () => {
    if (isFadingOut) return
    setIsFadingOut(true)
    timeoutRef.current = window.setTimeout(() => {
      onWake?.()
    }, 220)
  }

  const overlayStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      inset: 0,
      background: '#000',
      opacity: isFadingOut ? 0 : 1,
      transition: 'opacity 220ms ease',
    }),
    [isFadingOut],
  )

  useEffect(() => {
    const root = mountRef.current
    if (!root) return

    // --- runtime handles
    let renderer: THREE.WebGLRenderer | null = null
    let scene: THREE.Scene | null = null
    let camera: THREE.PerspectiveCamera | null = null

    let starMat: THREE.ShaderMaterial | null = null
    let starGeo: THREE.BufferGeometry | null = null
    let starPoints: THREE.Points | null = null
    let starLayers: Array<THREE.Points> = []

    let piscesGroup: THREE.Group | null = null
    let piscesStarMat: THREE.ShaderMaterial | null = null
    let piscesThinLine: THREE.Line | null = null
    let piscesGlowLine: THREE.Line | null = null
    let linesGeometry: THREE.BufferGeometry | null = null
    let bloomComposer: EffectComposer | null = null
    let finalComposer: EffectComposer | null = null
    let bloomPass: UnrealBloomPass | null = null

    const shooting: {
      line: THREE.Line | null
      startTime: number
      duration: number
      active: boolean
    } = { line: null, startTime: 0, duration: 1.6, active: false }
    // First meteor: 0.5-2s sonra, sonrakiler: 7-10s arası
    let nextShootingAt = 0.5 + Math.random() * 1.5

    // Reveal animation
    let animTime = 0
    let revealStarted = false
    const REVEAL_SECONDS = 3.37
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
    const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
    let stopLoop: null | (() => void) = null

    // input
    let targetX = 0
    let targetY = 0

    const cleanup = () => {
      stopLoop?.()
      stopLoop = null

      // Remove event listeners
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)

      if (scene && starPoints) scene.remove(starPoints)
      if (scene && piscesGroup) scene.remove(piscesGroup)

      starGeo?.dispose()
      starMat?.dispose()

      if (piscesGroup) {
        piscesGroup.traverse((obj: THREE.Object3D) => {
          const mesh = obj as THREE.Mesh
          mesh.geometry?.dispose()
          if (mesh.material) {
            if (Array.isArray(mesh.material))
              mesh.material.forEach((m: THREE.Material) => m.dispose())
            else mesh.material.dispose()
          }
        })
      }

      bloomComposer?.dispose()
      finalComposer?.dispose()
      bloomPass?.dispose()

      renderer?.dispose()
      if (renderer?.domElement && renderer.domElement.parentElement === root) {
        root.removeChild(renderer.domElement)
      }

      renderer = null
      const sceneToClean = scene
      scene = null
      camera = null

      starMat = null
      starGeo = null
      starPoints = null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      starLayers.forEach((p: any) => {
        if (sceneToClean) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sceneToClean as any).remove(p)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(p.geometry as any).dispose()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const material: any = p.material
        if (Array.isArray(material)) {
          material.forEach((m: any) => {
            try {
              m.dispose()
            } catch {
              // Material already disposed
            }
          })
        } else if (material) {
          try {
            material.dispose()
          } catch {
            // Material already disposed
          }
        }
      })
      starLayers = []

      if (shooting.line && sceneToClean) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(sceneToClean as any).remove(shooting.line)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(shooting.line.geometry as any).dispose()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lineMaterial: any = shooting.line.material
        if (Array.isArray(lineMaterial)) {
          lineMaterial.forEach((m: any) => {
            try {
              m.dispose()
            } catch {
              // Material already disposed
            }
          })
        } else if (lineMaterial) {
          try {
            lineMaterial.dispose()
          } catch {
            // Material already disposed
          }
        }
        shooting.line = null
      }

      piscesGroup = null
      piscesStarMat = null
      piscesThinLine = null
      piscesGlowLine = null
      linesGeometry = null

      bloomComposer = null
      finalComposer = null
      bloomPass = null

      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    // events
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      targetX = nx * 0.9
      targetY = -ny * 0.55
    }

    const onResize = () => {
      if (!renderer || !camera) return

      const w = root.clientWidth
      const h = root.clientHeight

      camera.aspect = w / h
      camera.updateProjectionMatrix()

      renderer.setSize(w, h)

      bloomComposer?.setSize(w, h)
      finalComposer?.setSize(w, h)
      bloomPass?.setSize(w, h)
    }

    const buildStarfield = (preset: Preset) => {
      if (!scene) return

      const layers = [
        {
          count: Math.floor(preset.starCount * 0.18),
          sizeMul: 1.55,
          depth: 220,
        },
        {
          count: Math.floor(preset.starCount * 0.32),
          sizeMul: 1.1,
          depth: 420,
        },
        {
          count: Math.floor(preset.starCount * 0.5),
          sizeMul: 0.85,
          depth: 780,
        },
      ]

      starLayers = []

      for (const L of layers) {
        const positions = new Float32Array(L.count * 3)
        const colors = new Float32Array(L.count * 3)
        const aSize = new Float32Array(L.count)
        const aTwinkle = new Float32Array(L.count)
        const aPhase = new Float32Array(L.count)

        const col = new THREE.Color()

        for (let i = 0; i < L.count; i++) {
          const r = L.depth * Math.cbrt(Math.random())
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)

          const x = r * Math.sin(phi) * Math.cos(theta)
          const y = r * Math.sin(phi) * Math.sin(theta)
          const z = r * Math.cos(phi)

          positions[i * 3 + 0] = x
          positions[i * 3 + 1] = y
          positions[i * 3 + 2] = z

          const v = 0.78 + Math.random() * 0.22
          col.setRGB(v, v, v)
          colors[i * 3 + 0] = col.r
          colors[i * 3 + 1] = col.g
          colors[i * 3 + 2] = col.b

          const p = Math.random()
          const base =
            p < 0.988 ? 0.75 + Math.random() * 0.95 : 2.0 + Math.random() * 1.8
          aSize[i] = base * L.sizeMul
          aTwinkle[i] = 0.55 + Math.random() * 1.6
          aPhase[i] = Math.random() * Math.PI * 2
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1))
        geo.setAttribute('aTwinkle', new THREE.BufferAttribute(aTwinkle, 1))
        geo.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1))

        const { material } = createStarShaderMaterial(preset)
        const points = new THREE.Points(geo, material)
        points.layers.set(0)

        scene.add(points)
        starLayers.push(points)
      }

      if (starLayers.length > 0) {
        starMat = starLayers[0].material as THREE.ShaderMaterial
      }
    }

    const buildPisces = () => {
      if (!scene || !starMat) return

      piscesGroup = new THREE.Group()
      scene.add(piscesGroup)

      const { starsGeometry, linesGeometry: linesGeo } = buildPiscesGeometry()
      linesGeometry = linesGeo

      // ===== CORE LAYER (Layer 0 - normal render) =====
      const piscesCoreGroup = new THREE.Group()
      piscesCoreGroup.layers.set(0)
      piscesGroup.add(piscesCoreGroup)

      const pMatCore = createPiscesStarMaterial(starMat)
      ;(pMatCore.uniforms as any).uBaseOpacity.value = 0.35
      const pStarsCore = new THREE.Points(starsGeometry, pMatCore)
      pStarsCore.layers.set(0)
      piscesCoreGroup.add(pStarsCore)

      const { thin, glow } = createLinesMaterials()
      thin.opacity = 0.25
      const thinLineCore = new THREE.Line(linesGeometry, thin)
      thinLineCore.layers.set(0)
      piscesCoreGroup.add(thinLineCore)

      // ===== BLOOM LAYER (Layer 1 - bloom render + reveal) =====
      const piscesBloomGroup = new THREE.Group()
      piscesBloomGroup.layers.set(BLOOM_LAYER)
      piscesGroup.add(piscesBloomGroup)

      piscesStarMat = createPiscesStarMaterial(starMat)
      ;(piscesStarMat.uniforms as any).uBaseOpacity.value = 1.0
      const pStarsBloom = new THREE.Points(starsGeometry, piscesStarMat)
      pStarsBloom.layers.set(BLOOM_LAYER)
      piscesBloomGroup.add(pStarsBloom)

      glow.opacity = 0.2
      piscesGlowLine = new THREE.Line(linesGeometry, glow)
      piscesGlowLine.layers.set(BLOOM_LAYER)
      piscesBloomGroup.add(piscesGlowLine)

      piscesThinLine = new THREE.Line(linesGeometry, thin)
      piscesThinLine.layers.set(BLOOM_LAYER)
      piscesBloomGroup.add(piscesThinLine)
    }

    const init = (preset: Preset) => {
      // Use viewport dimensions directly - sleep screen is fullscreen fixed
      const w = window.innerWidth
      const h = window.innerHeight

      // Scene
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000000)

      // Camera
      camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 5000)
      camera.position.set(0, 0, 220)

      // Renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(preset.pixelRatio)
      renderer.setSize(w, h)
      root.appendChild(renderer.domElement)

      buildStarfield(preset)
      buildPisces()

      // Composers (only if bloom enabled)
      if (preset.enableBloom) {
        bloomComposer = new EffectComposer(renderer)
        bloomComposer.renderToScreen = false
        bloomComposer.addPass(new RenderPass(scene, camera))

        bloomPass = new UnrealBloomPass(
          new THREE.Vector2(w, h),
          0.32, // strength
          0.7, // radius
          0.88, // threshold
        )
        bloomComposer.addPass(bloomPass)

        finalComposer = new EffectComposer(renderer)
        finalComposer.addPass(new RenderPass(scene, camera))

        const finalPass = new ShaderPass(
          new THREE.ShaderMaterial({
            uniforms: {
              baseTexture: { value: null },
              bloomTexture: { value: bloomComposer.renderTarget2.texture },
            },
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D baseTexture;
              uniform sampler2D bloomTexture;
              varying vec2 vUv;
              void main() {
                vec4 base = texture2D(baseTexture, vUv);
                vec4 bloom = texture2D(bloomTexture, vUv);
                gl_FragColor = base + bloom;
              }
            `,
          }),
          'baseTexture',
        )
        finalComposer.addPass(finalPass)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize', onResize)

      // Animation state (must be shared)
      let lastTime = performance.now()

      const createShootingStar = () => {
        const geo = new THREE.BufferGeometry()
        const pos = new Float32Array(2 * 3)
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

        const mat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.0,
        })

        const line = new THREE.Line(geo, mat)
        line.layers.set(0)
        scene!.add(line)
        return line
      }

      shooting.line = createShootingStar()

      const renderTick = () => {
        if (!renderer || !scene || !camera) return

        const now = performance.now()
        const dt = (now - lastTime) / 1000
        lastTime = now
        if (revealStarted) {
          animTime += dt
        }

        // ===== REVEAL ANIMATION =====
        const revealProgress = revealStarted
          ? clamp01(animTime / REVEAL_SECONDS)
          : 0
        const eased = easeOutCubic(revealProgress)

        // Update star reveal and emphasis uniform
        if (piscesStarMat) {
          ;(piscesStarMat.uniforms as any).uReveal.value = eased
          // Emphasis: 0.0 (başlangıç) → 1.0 (reveal sonunda)
          // Hafif gecikmeli, reveal bitince 1.0'a easeOut ile ulaşır
          let emphasis = 0
          if (revealProgress < 1.0) {
            emphasis = Math.max(0, (eased - 0.7) / 0.3) // Son %30'da artmaya başla
          } else {
            // Reveal bitince 0.8s boyunca 1.0→1.0 (sabit kalabilir veya hafif artabilir)
            emphasis = 1.0
          }
          ;(piscesStarMat.uniforms as any).uPiscesEmphasis.value = emphasis
        }

        // Update line geometry draw range (progressive drawing)
        const totalLineCount = linesGeometry ? linesGeometry.attributes.position.count : 0
        const visibleLineCount = Math.floor(eased * totalLineCount)
        if (piscesGlowLine && piscesThinLine) {
          ;(piscesGlowLine.geometry as any).setDrawRange(0, visibleLineCount)
          ;(piscesThinLine.geometry as any).setDrawRange(0, visibleLineCount)
        }

        // Fade line opacities during reveal
        if (piscesGlowLine && piscesThinLine) {
          const glowMat = piscesGlowLine.material as any
          const thinMat = piscesThinLine.material as any
          glowMat.opacity = 0.2 * eased
          thinMat.opacity = 0.55 * eased
        }

        if (starMat) starMat.uniforms.uTime.value = animTime

        // Drift + depth parallax
        if (starLayers.length) {
          starLayers.forEach((layer, idx) => {
            const k = idx === 0 ? 1.0 : idx === 1 ? 0.65 : 0.4
            layer.rotation.y = Math.sin(animTime * 0.02) * 0.05 * k
            layer.rotation.x = Math.cos(animTime * 0.015) * 0.03 * k
          })
        }

        // Subtle Pisces breathing (after reveal)
        if (piscesGroup) {
          const breatheFactor = revealProgress >= 1.0 ? 1.0 : 0
          piscesGroup.rotation.z =
            Math.sin(animTime * 0.01) * 0.006 * (0.5 + breatheFactor * 0.5)
        }

        // ===== SHOOTING STAR =====

        if (!shooting.active && animTime > nextShootingAt && shooting.line) {
          shooting.active = true
          shooting.startTime = animTime
          shooting.duration = 1.2 + Math.random() * 0.7

          const z = -140
          const x0 = -260 + Math.random() * 520
          const y0 = 80 + Math.random() * 180
          const x1 = x0 + (160 + Math.random() * 220)
          const y1 = y0 - (90 + Math.random() * 140)

          const arr = shooting.line!.geometry
            .attributes.position.array as Float32Array
          arr[0] = x0
          arr[1] = y0
          arr[2] = z
          arr[3] = x1
          arr[4] = y1
          arr[5] = z
          shooting.line!.geometry.attributes.position.needsUpdate = true
        }

        if (shooting.active && shooting.line) {
          const p = (animTime - shooting.startTime) / shooting.duration
          const mat = shooting.line.material as THREE.LineBasicMaterial

          if (p >= 1) {
            shooting.active = false
            mat.opacity = 0
            // Sonraki meteor 6-8s arası
            nextShootingAt = animTime + 6 + Math.random() * 2
          } else {
            const fade = p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1
            mat.opacity = 0.22 * fade
          }
        }

        // Parallax
        camera.position.x += (targetX - camera.position.x) * 0.02
        camera.position.y += (targetY - camera.position.y) * 0.02
        camera.lookAt(0, 0, 0)

        if (preset.enableBloom && bloomComposer && finalComposer) {
          // Bloom: only Pisces (BLOOM_LAYER)
          camera.layers.set(BLOOM_LAYER)
          bloomComposer.render()

          // Final: normal + bloom
          camera.layers.set(0)
          finalComposer.render()
        } else {
          camera.layers.set(0)
          renderer.render(scene, camera)
        }
      }

      stopLoop = makeFpsLoop(preset.fpsCap, renderTick)

      const renderOnce = () => renderTick()

      const disposeInit = () => {
        cleanup()
      }

      return { renderOnce, disposeInit }
    }

    // Auto-init with quick benchmark, but only start reveal after
    const startInit = () => {
      ;(async () => {
        const temp: Preset = {
          quality: 'battery',
          starCount: 1400,
          pixelRatio: 1.25,
          fpsCap: 60,
          enableBloom: false,
        }

        let ctx = init(temp)

        // Quick 15-frame benchmark (instead of 90) to minimize interruption
        const avgMs = await runMicroBenchmark(ctx.renderOnce, 15)

        ctx.disposeInit()

        const q = chooseQuality(avgMs, window.devicePixelRatio)
        const preset = getPreset(q)

        const safe: Preset = {
          ...preset,
          pixelRatio: Math.min(preset.pixelRatio, window.devicePixelRatio),
        }

        animTime = 0
        revealStarted = true
        ctx = init(safe)
      })()
    }

    // Chain multiple frames to ensure layout is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(startInit)
    })

    return () => {
      cleanup()
    }
  }, [])

  return (
    <div
      onClick={wake}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
          wake()
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 9999,
        ...overlayStyle,
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Nebula haze */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(900px 600px at 55% 45%, rgba(80,120,255,0.06) 0%, rgba(0,0,0,0) 55%)',
          mixBlendMode: 'screen',
          opacity: 0.35,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(1200px 800px at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Film grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.06,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Nebula haze */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: 0.32,
          background:
            'radial-gradient(900px 600px at 55% 45%, rgba(90,140,255,0.10) 0%, rgba(0,0,0,0) 60%), radial-gradient(800px 520px at 35% 55%, rgba(180,120,255,0.07) 0%, rgba(0,0,0,0) 62%)',
        }}
      />

      {/* Help text with premium fade animation */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 48,
          textAlign: 'center',
          fontFamily:
            'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial',
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.92)',
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: '0 2px 12px rgba(0,0,0,0.22)',
          animation: 'sleepHelpFade 3.8s ease-in-out infinite',
        }}
      >
        {t('sleep.wakeUpMessage')}
      </div>
    </div>
  )
}
