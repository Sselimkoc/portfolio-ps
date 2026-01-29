import * as THREE from 'three'
import type { Preset } from './sleepScreenUtils'

export interface StarMaterialData {
  material: THREE.ShaderMaterial
  uniforms: Record<string, THREE.Uniform>
}

export function createStarShaderMaterial(
  preset: Preset
): StarMaterialData {
  const uniforms = {
    uTime: new THREE.Uniform(0),
    uPixelRatio: new THREE.Uniform(preset.pixelRatio),
    uBaseOpacity: new THREE.Uniform(0.88),
  }

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms,
    vertexShader: `
      uniform float uTime;
      uniform float uPixelRatio;

      attribute float aSize;
      attribute float aTwinkle;
      attribute float aPhase;

      varying vec3 vColor;
      varying float vTw;

      void main() {
        vColor = color;

        float tw = 0.5 + 0.5 * sin(uTime * aTwinkle + aPhase);
        tw = smoothstep(0.0, 1.0, tw);
        vTw = tw;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float size = aSize * uPixelRatio * (220.0 / -mvPosition.z);
        gl_PointSize = clamp(size, 0.6, 7.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uBaseOpacity;
      varying vec3 vColor;
      varying float vTw;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);

        // Smooth professional core
        float core = smoothstep(0.5, 0.0, d);
        core = pow(core, 2.2);

        // Subtle outer glow
        float glow = exp(-d * d * 8.0) * 0.4;

        // Smooth twinkle
        float twinkle = mix(0.7, 1.0, vTw);
        float alpha = (core + glow) * uBaseOpacity * twinkle;

        // Professional color with subtle bloom
        vec3 col = vColor * (0.85 + 0.25 * twinkle);

        if (alpha < 0.01) discard;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  })

  return { material, uniforms }
}

export function createPiscesStarMaterial(
  baseStarMat: THREE.ShaderMaterial
): THREE.ShaderMaterial {
  const mat = baseStarMat.clone()

  mat.uniforms = {
    ...baseStarMat.uniforms,
    uBaseOpacity: new THREE.Uniform(1.0),
    uReveal: new THREE.Uniform(0.0),
    uPiscesEmphasis: new THREE.Uniform(0.0),
  }

  mat.vertexShader = `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uReveal;
    uniform float uPiscesEmphasis;

    attribute float aSize;
    attribute float aTwinkle;
    attribute float aPhase;
    attribute float aAppear;

    varying vec3 vColor;
    varying float vTw;
    varying float vAppear;

    void main() {
      vColor = color;

      float tw = 0.5 + 0.5 * sin(uTime * aTwinkle + aPhase);
      tw = smoothstep(0.0, 1.0, tw);
      vTw = tw;

      // Star reveal: progress through aAppear threshold
      float a = smoothstep(aAppear - 0.08, aAppear + 0.08, uReveal);
      vAppear = a;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float size = aSize * uPixelRatio * (220.0 / -mvPosition.z);

      // Emphasis: boost size after reveal
      float emphasis = 1.0 + 0.55 * uPiscesEmphasis;
      // Pop-in effect: grow while revealing
      gl_PointSize = clamp(size * mix(0.6, 1.0, a) * emphasis, 0.6, 15.0);

      gl_Position = projectionMatrix * mvPosition;
    }
  `

  mat.fragmentShader = `
    uniform float uBaseOpacity;
    uniform float uPiscesEmphasis;
    varying vec3 vColor;
    varying float vTw;
    varying float vAppear;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);

      float core = smoothstep(0.5, 0.0, d);
      core = pow(core, 1.7);

      float glow = exp(-d * d * 8.0) * 0.4;

      float twinkle = mix(0.7, 1.0, vTw);
      float alpha = (core + glow) * uBaseOpacity * twinkle * vAppear;
      // Emphasis: boost alpha after reveal
      alpha *= mix(1.0, 1.55, uPiscesEmphasis);

      vec3 col = vColor * (0.85 + 0.45 * twinkle);

      if (alpha < 0.01) discard;
      gl_FragColor = vec4(col, alpha);
    }
  `

  return mat
}

export interface LineMaterials {
  thin: THREE.LineBasicMaterial
  glow: THREE.LineBasicMaterial
}

export function createLinesMaterials(): LineMaterials {
  const thin = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    linewidth: 1.5,
  })

  const glow = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.18,
    linewidth: 2.5,
  })

  return { thin, glow }
}
