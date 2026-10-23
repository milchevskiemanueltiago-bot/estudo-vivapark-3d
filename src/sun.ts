/** Geometria solar para Porto Belo/Itapema (latitude ≈ -27,16°). Hora = hora solar; sem sombra de vizinhos. */
export const LAT = -27.1627

export type Estacao = 'verao' | 'inverno' | 'equinocio'

export const ESTACOES: Record<Estacao, { rotulo: string; data: string; decl: number }> = {
  verao: { rotulo: 'Verão', data: '21/dez', decl: -23.44 },
  inverno: { rotulo: 'Inverno', data: '21/jun', decl: 23.44 },
  equinocio: { rotulo: 'Equinócio', data: '21/mar e 23/set', decl: 0 },
}

const rad = (g: number) => (g * Math.PI) / 180

export interface Sol {
  /** altura sobre o horizonte, em graus */
  alt: number
  /** azimute em graus a partir do Norte, no sentido horário (90 = Leste, 270 = Oeste) */
  az: number
}

export function posicaoSol(estacao: Estacao, horaSolar: number): Sol {
  const phi = rad(LAT)
  const dec = rad(ESTACOES[estacao].decl)
  const h = rad(15 * (horaSolar - 12))
  const sinAlt = Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(h)
  const alt = Math.asin(sinAlt)
  const azSul = Math.atan2(Math.sin(h), Math.cos(h) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi))
  const az = ((azSul + Math.PI) * 180) / Math.PI
  return { alt: (alt * 180) / Math.PI, az: ((az % 360) + 360) % 360 }
}

/** Vetor unitário apontando para o sol. Eixos: +X Leste, +Y para cima, -Z Norte. */
export function vetorSol(s: Sol): [number, number, number] {
  const a = rad(s.alt)
  const z = rad(s.az)
  return [Math.sin(z) * Math.cos(a), Math.sin(a), -Math.cos(z) * Math.cos(a)]
}

export function nascerEPor(estacao: Estacao): { nasce: number; poe: number } {
  const phi = rad(LAT)
  const dec = rad(ESTACOES[estacao].decl)
  const h = Math.acos(-Math.tan(phi) * Math.tan(dec))
  return { nasce: 12 - (h * 180) / Math.PI / 15, poe: 12 + (h * 180) / Math.PI / 15 }
}

export type Fachada = 'N' | 'L' | 'S' | 'O'
export const AZ_FACHADA: Record<Fachada, number> = { N: 0, L: 90, S: 180, O: 270 }

/** Horas de sol direto numa fachada vertical voltada para `azFachada` (sem obstrução). */
export function horasDeSol(estacao: Estacao, azFachada: number): number {
  const n: [number, number] = [Math.sin(rad(azFachada)), -Math.cos(rad(azFachada))]
  let horas = 0
  for (let t = 4; t <= 20; t += 0.1) {
    const s = posicaoSol(estacao, t)
    if (s.alt <= 0) continue
    const v = vetorSol(s)
    if (v[0] * n[0] + v[2] * n[1] > 0.05) horas += 0.1
  }
  return horas
}
