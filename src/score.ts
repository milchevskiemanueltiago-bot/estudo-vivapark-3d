import { HISTORICO, OBRAS } from './data.ts'
import type { Obra } from './data.ts'

/** Pesos do modelo (somam 100). É um julgamento nosso, não um índice oficial. */
export const PESOS = { preco: 22, estagio: 20, lastro: 20, local: 18, liquidez: 10, juridico: 10 } as const
export type Criterio = keyof typeof PESOS

export const ROTULO_CRITERIO: Record<Criterio, string> = {
  preco: 'Preço do m² frente à região',
  estagio: 'Janela de valorização (fase da obra)',
  lastro: 'Histórico da construtora',
  local: 'Localização e entorno',
  liquidez: 'Liquidez (tipo e tamanho)',
  juridico: 'Risco jurídico (Registro de Incorporação)',
}

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v))

const medianaPm2 = (() => {
  const v = OBRAS.map((o) => o.pm2).filter((x): x is number => x != null).sort((a, b) => a - b)
  return v[Math.floor(v.length / 2)]
})()
export const MEDIANA_PM2 = medianaPm2

function lastroDe(construtora: string): { nota: number; base: string } {
  const partes = construtora.split('/').map((s) => s.trim())
  const notas: number[] = []
  const usados: string[] = []
  for (const p of partes) {
    const h = HISTORICO[p]
    if (!h) continue
    let n = 30 + 10 * Math.log2(1 + h.entregues)
    if (h.emObra / Math.max(1, h.entregues) > 1.5) n -= 8
    notas.push(n)
    usados.push(`${p}: ${h.entregues} entregues, ${h.emObra} em obra`)
  }
  if (notas.length === 0) return { nota: 45, base: 'Sem histórico no DWV (nota neutra 45)' }
  return { nota: clamp(notas.reduce((a, b) => a + b, 0) / notas.length), base: usados.join(' · ') }
}

export interface Pontuacao {
  total: number
  tier: 'A' | 'B' | 'C'
  partes: Record<Criterio, number>
  lastroBase: string
  tendencia: 'Alta' | 'Moderada' | 'Contida'
}

export function pontuar(o: Obra): Pontuacao {
  const preco = o.pm2 == null ? 50 : clamp(60 + ((medianaPm2 - o.pm2) / medianaPm2) * 120, 15, 95)
  let estagio = 50
  if (o.fase === 'Pronto') estagio = 45
  else if (o.fase === 'Futuro lançamento') estagio = 50
  else if (o.fase === 'Pré-lançamento') estagio = 58
  else {
    const p = o.obra ?? 0
    estagio = p >= 90 ? 62 : p >= 60 ? 80 : p >= 20 ? 86 : 78
  }
  const lastro = lastroDe(o.c)
  const a = o.area
  const liquidez = o.tipo === 'Sala comercial' ? 55 : a == null ? 50 : a <= 45 ? 80 : a <= 90 ? 88 : a <= 140 ? 70 : a <= 200 ? 52 : 38
  const juridico = o.ri === false ? 25 : o.ri === true ? 90 : (o.obra ?? 0) >= 20 ? 62 : 55
  const partes: Record<Criterio, number> = { preco, estagio, lastro: lastro.nota, local: o.loc, liquidez, juridico }
  const total = (Object.keys(PESOS) as Criterio[]).reduce((s, k) => s + (partes[k] * PESOS[k]) / 100, 0)
  const tier = total >= 74 ? 'A' : total >= 66 ? 'B' : 'C'
  const t = o.loc * 0.4 + preco * 0.35 + estagio * 0.25
  return { total, tier, partes, lastroBase: lastro.base, tendencia: t >= 78 ? 'Alta' : t >= 68 ? 'Moderada' : 'Contida' }
}

/** Meses entre hoje (23/10/2026) e a entrega AAAA-MM; nunca negativo. */
export function mesesAteEntrega(ent: string | null, hoje = new Date(2026, 9, 23)): number | null {
  const m = ent ? /^(\d{4})-(\d{2})/.exec(ent) : null
  if (!m) return null
  return Math.max(0, (Number(m[1]) - hoje.getFullYear()) * 12 + (Number(m[2]) - (hoje.getMonth() + 1)))
}

export interface Cenario {
  rotulo: string
  taxa: number
  valorNaEntrega: number
  /** ganho sobre o capital desembolsado até a entrega (premissa: 30% do preço pagos até lá) */
  retornoCapital: number
}

/** Premissas editáveis do estudo: valorização 5/10/15% a.a. e 30% do preço pagos até a entrega. */
export function cenarios(o: Obra): Cenario[] | null {
  const m = mesesAteEntrega(o.ent)
  if (o.ap == null || m == null) return null
  return [
    { rotulo: 'Conservador', taxa: 5 },
    { rotulo: 'Base', taxa: 10 },
    { rotulo: 'Otimista', taxa: 15 },
  ].map((c) => {
    const valor = o.ap! * Math.pow(1 + c.taxa / 100, m / 12)
    return { ...c, valorNaEntrega: valor, retornoCapital: ((valor - o.ap!) / (0.3 * o.ap!)) * 100 }
  })
}
