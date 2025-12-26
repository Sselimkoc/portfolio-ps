type Quality = 'high' | 'balanced' | 'battery'

export type Preset = {
  quality: Quality
  starCount: number
  pixelRatio: number
  fpsCap: number
  enableBloom: boolean
}

export function chooseQuality(avgMs: number, dpr: number): Quality {
  const penalty = dpr > 1.75 ? 2 : dpr > 1.35 ? 1 : 0
  const ms = avgMs + penalty
  if (ms < 18) return 'high'
  if (ms < 28) return 'balanced'
  return 'battery'
}

export function getPreset(q: Quality): Preset {
  if (q === 'high')
    return {
      quality: q,
      starCount: 5200,
      pixelRatio: 2,
      fpsCap: 60,
      enableBloom: true,
    }
  if (q === 'balanced')
    return {
      quality: q,
      starCount: 3400,
      pixelRatio: 1.5,
      fpsCap: 45,
      enableBloom: false,
    }
  return {
    quality: q,
    starCount: 2000,
    pixelRatio: 1.25,
    fpsCap: 30,
    enableBloom: false,
  }
}

export async function runMicroBenchmark(
  renderOnce: () => void,
  frames = 90
): Promise<number> {
  return new Promise<number>((resolve) => {
    let count = 0
    let last = performance.now()
    const times: Array<number> = []

    const step = () => {
      renderOnce()
      const now = performance.now()
      times.push(now - last)
      last = now

      count++
      if (count >= frames) {
        const trimmed = times.slice(10)
        const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length
        resolve(avg)
        return
      }
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  })
}

export function makeFpsLoop(fpsCap: number, tick: () => void) {
  const frameInterval = 1000 / fpsCap
  let raf = 0
  let last = performance.now()

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop)
    const delta = now - last
    if (delta < frameInterval) return
    last = now - (delta % frameInterval)
    tick()
  }

  raf = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(raf)
}
