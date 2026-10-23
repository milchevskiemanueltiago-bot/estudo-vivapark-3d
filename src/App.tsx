import { Suspense, lazy, useMemo, useState } from 'react'
import { MEIA_PRAIA_CENTRO, OBRAS, REGIOES, VIVAPARK_ACESSO } from './data.ts'
import type { Obra, Regiao } from './data.ts'
import { MEDIANA_PM2, PESOS, ROTULO_CRITERIO, cenarios, mesesAteEntrega, pontuar } from './score.ts'
import type { Criterio } from './score.ts'

const Masterplan = lazy(() => import('./Masterplan.tsx'))
const TowerStudy = lazy(() => import('./TowerStudy.tsx'))

const brl = (v: number | null) => (v == null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }))
const mi = (v: number | null) => (v == null ? '—' : v >= 1e6 ? `R$ ${(v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} mi` : `R$ ${Math.round(v / 1e3)} mil`)
const mes = (s: string | null) => (s ? `${s.slice(5)}/${s.slice(0, 4)}` : '—')

const PONTUADAS = OBRAS.map((o) => ({ o, p: pontuar(o) })).sort((a, b) => b.p.total - a.p.total)
const POR_ID = new Map(PONTUADAS.map((x) => [x.o.id, x]))

/** Ilustração esquemática em elevação: faixas = pavimentos publicados; tracejado = sem dado; preenchimento = % da obra. */
function Elevacao({ o, w = 56, h = 84 }: { o: Obra; w?: number; h?: number }) {
  const known = o.pav != null
  const rows = Math.min(o.pav ?? 14, 34)
  const top = 10
  const bh = h - top - 8
  const fh = bh / rows
  const cor = o.g === 'vivapark' ? '#0A2540' : o.g === 'entorno' ? '#1B8A9A' : '#6B4FA0'
  const obra = o.obra ?? 0
  const y0 = top + bh * (1 - obra / 100)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Elevação esquemática de ${o.nome}`}>
      <rect x={12} y={top} width={w - 24} height={bh} fill={known ? '#fff' : 'none'} stroke={cor} strokeWidth={2} strokeDasharray={known ? undefined : '4 3'} />
      {obra > 0 && <rect x={12} y={y0} width={w - 24} height={top + bh - y0} fill={cor} opacity={0.85} />}
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <line key={i} x1={12} x2={w - 12} y1={top + (i + 1) * fh} y2={top + (i + 1) * fh} stroke={cor} strokeWidth={0.6} opacity={0.55} />
      ))}
      <rect x={8} y={top - 5} width={w - 16} height={5} fill="#FFC72C" stroke={cor} />
      <line x1={3} x2={w - 3} y1={h - 6} y2={h - 6} stroke={cor} strokeWidth={2} />
    </svg>
  )
}

function Barras({ o }: { o: Obra }) {
  const p = POR_ID.get(o.id)!.p
  return (
    <div className="barras">
      {(Object.keys(PESOS) as Criterio[]).map((k) => (
        <div key={k} className="barra">
          <span>
            {ROTULO_CRITERIO[k]} <small>peso {PESOS[k]}</small>
          </span>
          <div className="trilho">
            <i style={{ width: `${p.partes[k]}%` }} />
          </div>
          <b>{Math.round(p.partes[k])}</b>
        </div>
      ))}
      <p className="mini">Histórico da construtora: {p.lastroBase}</p>
    </div>
  )
}

function Dossie({ o }: { o: Obra }) {
  const { p } = POR_ID.get(o.id)!
  const cen = cenarios(o)
  const m = mesesAteEntrega(o.ent)
  return (
    <div className="dossie">
      <div className="dossie-topo">
        <div>
          <h3>{o.nome}</h3>
          <p className="mini">
            {o.c} · {o.bairro} · {o.end}
          </p>
          <div className="tags">
            <span className="tag">{o.fase}{o.obra ? ` ${o.obra}%` : ''}</span>
            <span className={`tag tier-${p.tier}`}>Classe {p.tier} · {Math.round(p.total)}/100</span>
            <span className="tag">Tendência de valorização: {p.tendencia}</span>
            {o.ri === false && <span className="tag risco">Pré-reserva · sem RI</span>}
          </div>
        </div>
        <div className="preco">
          {mi(o.ap)}
          <small>a partir de · {o.pm2 ? `${brl(o.pm2)}/m²` : 'R$/m² —'}</small>
        </div>
      </div>
      <dl className="ficha">
        <dt>Unidades à venda (DWV)</dt><dd>{o.disp ?? '—'}</dd>
        <dt>Pavimentos / torres</dt><dd>{o.pav ?? '—'} / {o.torres ?? '—'}</dd>
        <dt>Quartos</dt><dd>{o.q}</dd>
        <dt>Metragens</dt><dd>{o.areas}</dd>
        <dt>Entrega</dt><dd>{mes(o.ent)}{m != null ? ` (${m} meses)` : ''}</dd>
        <dt>Lazer</dt><dd>{o.lm2 ? `${o.lm2.toLocaleString('pt-BR')} m²` : '—'}</dd>
      </dl>
      {o.lazer.length > 0 && <p className="mini"><b>Lazer:</b> {o.lazer.join(' · ')}</p>}
      <h4>Como a nota foi composta</h4>
      <Barras o={o} />
      <h4>Cenários até a entrega (premissas)</h4>
      {cen ? (
        <div className="tablewrap">
          <table className="t">
            <thead><tr><th>Cenário</th><th>Valorização</th><th>Valor na entrega</th><th>Retorno s/ capital*</th></tr></thead>
            <tbody>
              {cen.map((c) => (
                <tr key={c.rotulo}><td>{c.rotulo}</td><td>{c.taxa}% a.a.</td><td>{mi(c.valorNaEntrega)}</td><td>{c.retornoCapital.toFixed(0)}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mini">— Sem preço ou data de entrega publicados: não dá para projetar.</p>
      )}
      <p className="mini">*Premissa: 30% do preço pagos até a entrega. A valorização é suposição do estudo, não dado de mercado.</p>
      {o.nota && <p className="mini"><b>Observação:</b> {o.nota}</p>}
    </div>
  )
}

const NAV = [['tese', 'Tese'], ['mapa-vp', 'VivaPark 3D'], ['ranking', 'Ranking'], ['dossie', 'Dossiês'], ['mapa-it', 'Meia Praia'], ['estrategia', 'Estratégia'], ['riscos', 'Riscos'], ['fontes', 'Fontes']]

export default function App() {
  const [sel, setSel] = useState('vertice')
  const [regiao, setRegiao] = useState<Regiao | 'todas'>('vivapark')
  const selObra = POR_ID.get(sel)!.o
  const lista = useMemo(() => PONTUADAS.filter((x) => regiao === 'todas' || x.o.g === regiao), [regiao])
  const vp = OBRAS.filter((o) => o.g === 'vivapark')
  const it = OBRAS.filter((o) => o.g === 'itapema')
  const vpPm2 = vp.filter((o) => o.pm2)
  const mediaVp = vpPm2.reduce((s, o) => s + (o.pm2 ?? 0), 0) / vpPm2.length
  const itPm2 = it.filter((o) => o.pm2 && o.id !== 'mayfair')
  const mediaIt = itPm2.reduce((s, o) => s + (o.pm2 ?? 0), 0) / itPm2.length
  const escolher = (id: string) => {
    setSel(id)
    const o = POR_ID.get(id)!.o
    setRegiao(o.g)
    document.getElementById('dossie')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="nav">
        <b>VivaPark 3D</b>
        {NAV.map(([id, r]) => (
          <a key={id} href={`#${id}`}>{r}</a>
        ))}
        <a href="./estudo-mapa-2d.html" target="_blank" rel="noreferrer">Mapa satélite (2D)</a>
      </nav>

      <section className="hero">
        <div className="hero-3d">
          <Suspense fallback={null}>
            <Masterplan obras={vp} centro={VIVAPARK_ACESSO} escala={1} selecionada={sel} onSelecionar={escolher} giraComScroll acesso={VIVAPARK_ACESSO} raio={250} />
          </Suspense>
        </div>
        <div className="hero-txt">
          <h1>Estudo de investimento: VivaPark e Meia Praia</h1>
          <p>Visão de investidor: onde, quando e quanto. {OBRAS.length} obras classificadas por um modelo transparente, com maquete 3D, sol de verão e inverno e cenários de valorização. Gire com o mouse, role a página.</p>
          <div className="kpis">
            <div><b>{OBRAS.length}</b><span>obras analisadas</span></div>
            <div><b>{brl(Math.round(mediaVp))}</b><span>R$/m² de entrada no VivaPark</span></div>
            <div><b>{brl(MEDIANA_PM2)}</b><span>mediana geral (DWV)</span></div>
            <div><b>{PONTUADAS.filter((x) => x.p.tier === 'A').length}</b><span>obras classe A</span></div>
          </div>
        </div>
      </section>

      <main className="wrap">
        <section id="tese">
          <h2>Tese de mercado</h2>
          <div className="cols">
            <div className="caixa"><h4>Porto Belo está em ciclo forte</h4><p>Primeiro semestre de 2026: R$ 2,5 bilhões em imóveis novos e lançamentos, 2.850 unidades; m² médio vendido R$ 14.712, 9,7% acima do estoque disponível. População cresceu mais de 72% em uma década. <small>(NSC Total / Portas, 2026)</small></p></div>
            <div className="caixa"><h4>Itapema virou o m² mais caro do país</h4><p>FipeZAP 2026: Itapema na faixa de R$ 15,2–15,4 mil/m², alta de 12 meses entre 5,4% e 6,4%, à frente de Balneário Camboriú. Teto de preço da região. <small>(Portas, MySide, Folha Vitória)</small></p></div>
            <div className="caixa"><h4>VivaPark cobra prêmio</h4><p>Entrada no VivaPark: {brl(Math.round(mediaVp))}/m² (DWV), cerca de {Math.round((mediaVp / 14712 - 1) * 100)}% acima do m² médio vendido em Porto Belo. O prêmio paga bairro planejado de 550 mil m², lagos, segurança, escola e comércio, mas reduz a folga de valorização para quem entra tarde.</p></div>
            <div className="caixa"><h4>Meia Praia: preço alto, obra madura</h4><p>Entrada média das obras do DWV em Itapema: {brl(Math.round(mediaIt))}/m² (sem o 143 Mayfair, pronto). O portal Apto.vc mostra média de listagens da Meia Praia perto de R$ 24 mil/m², com topo de alto padrão acima de R$ 60 mil.</p></div>
          </div>
          <p className="mini">Atenção: índices FipeZAP medem anúncios, não preços de venda efetivos, e não há série oficial para o VivaPark isoladamente. As projeções deste estudo são premissas.</p>
        </section>

        <section id="mapa-vp">
          <h2>VivaPark em 3D</h2>
          <p className="lede">Cada prédio na altura dos pavimentos publicados (transparente = pavimentos não publicados, 14 andares só para ilustrar). Amarelo = classe A, verde-água = B, cinza = C. Clique para abrir o dossiê.</p>
          <div className="stage">
            <Suspense fallback={<p className="mini pad">Carregando maquete…</p>}>
              <Masterplan obras={vp} centro={VIVAPARK_ACESSO} escala={1} selecionada={sel} onSelecionar={escolher} acesso={VIVAPARK_ACESSO} raio={420} />
            </Suspense>
          </div>
          <p className="mini">Posições estimadas pela rua do endereço publicado; confirme no local.</p>
        </section>

        <section id="ranking">
          <h2>Ranking de investimento</h2>
          <p className="lede">Modelo de pontuação (0–100) com pesos explícitos. Classe A ≥ 74, B ≥ 66, C abaixo. Julgamento nosso: use como filtro, não como veredito.</p>
          <div className="tablewrap">
            <table className="t">
              <thead><tr><th>#</th><th>Obra</th><th>Região</th><th>Fase</th><th>Classe</th><th>Nota</th><th>Tendência</th><th>R$/m²</th><th>A partir de</th></tr></thead>
              <tbody>
                {PONTUADAS.map(({ o, p }, i) => (
                  <tr key={o.id} className="click" onClick={() => escolher(o.id)}>
                    <td>{i + 1}</td><td><b>{o.nome}</b></td><td>{REGIOES[o.g].split(' · ')[0]}</td><td>{o.fase}{o.obra ? ` ${o.obra}%` : ''}</td>
                    <td><span className={`tag tier-${p.tier}`}>{p.tier}</span></td><td>{Math.round(p.total)}</td><td>{p.tendencia}</td><td className="n">{o.pm2 ? brl(o.pm2) : '—'}</td><td className="n">{mi(o.ap)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="dossie">
          <h2>Dossiê de cada obra</h2>
          <div className="seg filtro">
            {(['vivapark', 'entorno', 'itapema', 'todas'] as const).map((r) => (
              <button key={r} type="button" className={regiao === r ? 'on' : ''} onClick={() => setRegiao(r)}>
                {r === 'todas' ? 'Todas' : REGIOES[r]}
              </button>
            ))}
          </div>
          <div className="dossie-grid">
            <ul className="lista">
              {lista.map(({ o, p }) => (
                <li key={o.id}>
                  <button type="button" className={sel === o.id ? 'on' : ''} onClick={() => setSel(o.id)}>
                    <Elevacao o={o} w={40} h={60} />
                    <span><b>{o.nome}</b><small>{o.c} · {o.fase}{o.obra ? ` ${o.obra}%` : ''}</small></span>
                    <span className={`tag tier-${p.tier}`}>{p.tier} {Math.round(p.total)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="painel">
              <Suspense fallback={<p className="mini pad">Carregando maquete…</p>}>
                <TowerStudy key={selObra.id} obra={selObra} />
              </Suspense>
              <Dossie o={selObra} />
            </div>
          </div>
        </section>

        <section id="mapa-it">
          <h2>Meia Praia e Itapema em 3D</h2>
          <p className="lede">Obras do DWV em Itapema, com prédios ampliados 5× para aparecerem na escala da cidade. Construtoras com maior histórico de entrega no painel do DWV: AP | Pasqualotto (30 entregues) e MS (14). Balanço financeiro das construtoras não é público no DWV: use o histórico de entregas como indício, nunca como garantia.</p>
          <div className="stage">
            <Suspense fallback={<p className="mini pad">Carregando maquete…</p>}>
              <Masterplan obras={it} centro={MEIA_PRAIA_CENTRO} escala={5} selecionada={sel} onSelecionar={escolher} raio={2600} />
            </Suspense>
          </div>
        </section>

        <section id="estrategia">
          <h2>Estratégia de um investidor criterioso</h2>
          <div className="cols">
            <div className="caixa"><h4>Núcleo: obra entre 20% e 60%</h4><p>Risco de execução já mitigado e ainda há ganho de canteiro. No VivaPark: Voz (44%) e Vértice (60%), ambos com Torresani (61 entregas). Em Itapema: Green Ville e San Felice (Pasqualotto).</p></div>
            <div className="caixa"><h4>Alavancagem: planta cedo, com lastro</h4><p>Pré-lançamento tem a maior janela, mas o prazo é longo (2030+) e o capital fica preso. Priorize quem já entregou muito e confirme o Registro de Incorporação antes de qualquer sinal. Vitta 27 e Verenna estão em pré-reserva sem RI.</p></div>
            <div className="caixa"><h4>Renda: pequeno e líquido</h4><p>Studios e 1–2 dormitórios (Voz, Veleiros, Lagom) têm saída mais fácil na revenda e na locação por temporada. Unidades acima de 150 m² demandam comprador de alto padrão e demoram a girar.</p></div>
            <div className="caixa"><h4>Diversificar entre os dois mercados</h4><p>VivaPark é aposta em bairro planejado em formação; Meia Praia é mercado consolidado, caro e mais líquido. Combinar reduz o risco de concentração em um único lançador.</p></div>
          </div>
          <p className="mini">Este material é análise de mercado com premissas declaradas, não recomendação de investimento personalizada nem promessa de retorno. Triplicar capital exige prazo, alavancagem e valorização acima das premissas deste estudo.</p>
        </section>

        <section id="riscos">
          <h2>Riscos e checklist de diligência</h2>
          <ul className="check">
            <li>Registro de Incorporação no cartório e patrimônio de afetação da obra.</li>
            <li>Certidões da incorporadora e da construtora; CNPJ, histórico de atrasos e processos.</li>
            <li>Contrato: correção pelo INCC, multa de rescisão, prazo de tolerância e distrato.</li>
            <li>Liquidez: quantas unidades iguais estarão à venda na entrega (concorrência na revenda).</li>
            <li>Orientação solar da unidade e vista (face norte e andares altos valorizam mais).</li>
            <li>Condomínio de alto lazer: custo mensal pesa na renda por temporada.</li>
            <li>Dados de preço do DWV são de tabela e mudam; portais divergem do DWV em fase e entrega.</li>
          </ul>
        </section>

        <section id="fontes">
          <h2>Fontes e método</h2>
          <p className="mini">Preços, R$/m², disponíveis e fase de obra: DWV (conta do corretor), 22/10/2026. Pavimentos, lazer e unidades por andar: MySide e páginas dos empreendimentos. Mercado: FipeZAP via Portas, MySide e Folha Vitória (Itapema); NSC Total e Portas (Porto Belo); Apto.vc (listagens da Meia Praia). Posição do VivaPark: link do Google Maps enviado (-27,16108; -48,60431) e OpenStreetMap. Sol: cálculo astronômico para a latitude -27,16°. Nota de localização, pesos e cenários são julgamentos e premissas deste estudo. Pavimentos não publicados usam 14 andares apenas como ilustração.</p>
        </section>
      </main>
    </>
  )
}
