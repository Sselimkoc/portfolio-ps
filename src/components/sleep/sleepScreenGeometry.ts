import * as THREE from 'three'
import type { Preset } from './sleepScreenUtils'

const PISCES_2D: Array<[number, number]> = [
  [-0.25, 0.35],
  [-0.18, 0.33],
  [-0.14, 0.28],
  [-0.2, 0.22],
  [-0.28, 0.25],
  [-0.22, 0.18],
  [-0.22, 0.05],
  [-0.2, -0.1],
  [-0.32, -0.32],
  [-0.1, -0.2],
  [0.08, -0.18],
  [0.22, -0.16],
  [0.38, -0.12],
  [0.5, -0.08],
  [0.58, -0.12],
  [0.56, -0.2],
  [0.46, -0.2],
]

export interface StarfieldGeometry {
  geometry: THREE.BufferGeometry
  attributes: {
    positions: Float32Array
    colors: Float32Array
    aSize: Float32Array
    aTwinkle: Float32Array
    aPhase: Float32Array
  }
}

export function buildStarfieldGeometry(
  preset: Preset
): StarfieldGeometry {
  const STAR_COUNT = preset.starCount

  const positions = new Float32Array(STAR_COUNT * 3)
  const colors = new Float32Array(STAR_COUNT * 3)
  const aSize = new Float32Array(STAR_COUNT)
  const aTwinkle = new Float32Array(STAR_COUNT)
  const aPhase = new Float32Array(STAR_COUNT)

  const col = new THREE.Color()

  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 1200 * Math.cbrt(Math.random())
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
    aSize[i] = p < 0.988 ? 0.75 + Math.random() * 0.95 : 2.0 + Math.random() * 1.8
    aTwinkle[i] = 0.55 + Math.random() * 1.6
    aPhase[i] = Math.random() * Math.PI * 2
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1))
  geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(aTwinkle, 1))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1))

  return {
    geometry,
    attributes: {
      positions,
      colors,
      aSize,
      aTwinkle,
      aPhase,
    },
  }
}

export interface PiscesGeometry {
  starsGeometry: THREE.BufferGeometry
  linesGeometry: THREE.BufferGeometry
  worldPoints: Array<THREE.Vector3>
}

export function buildPiscesGeometry(): PiscesGeometry {
  const z = -120
  const scale = 180
  const toWorld = (nx: number, ny: number) =>
    new THREE.Vector3(nx * scale, ny * scale, z)
  const world = PISCES_2D.map(([x, y]) => toWorld(x, y))

  // Constellation stars
  const pCount = world.length
  const pPos = new Float32Array(pCount * 3)
  const pCol = new Float32Array(pCount * 3)
  const pSize = new Float32Array(pCount)
  const pTw = new Float32Array(pCount)
  const pPh = new Float32Array(pCount)

  for (let i = 0; i < pCount; i++) {
    const v = world[i]
    pPos[i * 3 + 0] = v.x
    pPos[i * 3 + 1] = v.y
    pPos[i * 3 + 2] = v.z

    // Cool white color (0.92, 0.95, 1.0)
    pCol[i * 3 + 0] = 0.92
    pCol[i * 3 + 1] = 0.95
    pCol[i * 3 + 2] = 1.0

    // Larger key stars (8, 13), smaller others
    pSize[i] = i === 8 || i === 13 ? 6.5 : 3.0
    pTw[i] = 0.35 + Math.random() * 0.4  // Slower twinkle
    pPh[i] = Math.random() * Math.PI * 2
  }

  // Add appear attribute for reveal animation
  const aAppear = new Float32Array(pCount)
  for (let i = 0; i < pCount; i++) {
    aAppear[i] = Math.random() // 0..1 random order
  }

  const starsGeometry = new THREE.BufferGeometry()
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(pCol, 3))
  starsGeometry.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1))
  starsGeometry.setAttribute('aTwinkle', new THREE.BufferAttribute(pTw, 1))
  starsGeometry.setAttribute('aPhase', new THREE.BufferAttribute(pPh, 1))
  starsGeometry.setAttribute('aAppear', new THREE.BufferAttribute(aAppear, 1))

  // Lines - Smooth curves with CatmullRomCurve3 (reveal-friendly)
  const pathA = [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  const pathB = [13, 14, 15, 16, 13]

  const sampleCurve = (idxs: Array<number>, samples = 80) => {
    const pts = idxs.map((i) => world[i])
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.65)
    return curve.getPoints(samples)
  }

  const ptsA = sampleCurve(pathA, 140)
  const ptsB = sampleCurve(pathB, 80)

  // Single polyline: A then B
  const allPoints = [...ptsA, ...ptsB]

  const linePos = new Float32Array(allPoints.length * 3)
  const aT = new Float32Array(allPoints.length)

  for (let i = 0; i < allPoints.length; i++) {
    linePos[i * 3 + 0] = allPoints[i].x
    linePos[i * 3 + 1] = allPoints[i].y
    linePos[i * 3 + 2] = allPoints[i].z
    aT[i] = i / Math.max(1, allPoints.length - 1) // 0..1
  }

  const linesGeometry = new THREE.BufferGeometry()
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
  linesGeometry.setAttribute('aT', new THREE.BufferAttribute(aT, 1))

  // Start hidden (reveal via drawRange)
  linesGeometry.setDrawRange(0, 0)

  return {
    starsGeometry,
    linesGeometry,
    worldPoints: world,
  }
}
