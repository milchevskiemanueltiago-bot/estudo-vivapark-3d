import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { InstancedMesh, Matrix4, Object3D } from 'three'
import type { DirectionalLight } from 'three'
import type { Obra } from './data.ts'
import { AZ_FACHADA, ESTACOES, horasDeSol, nascerEPor, posicaoSol, vetorSol } from './sun.ts'
import type { Estacao, Fachada } from './sun.ts'

const PAV_ESTIMADO = 14
const W = 22
const D = 16
const H = 3

function Janelas({ pav, torres }: { pav: number; torres: number }) {
  const ref = useRef<InstancedMesh>(null)
  const total = pav * torres * (6 * 2 + 4 * 2)
  useEffect(() => {
    const m = ref.current
    if (!m) return
    const o = new Object3D()
    const mat = new Matrix4()
    let i = 0
    for (let t = 0; t < torres; t++) {
      const cx = (t - (torres - 1) / 2) * (W + 10)
      for (let f = 0; f < pav; f++) {
        const y = f * H + H * 0.55
        for (const face of [1, -1]) {
          for (let k = 0; k < 6; k++) {
            o.position.set(cx - W / 2 + (W / 6) * (k + 0.5), y, (D / 2 + 0.05) * face)
            o.scale.set(1, 1, 1)
            o.updateMatrix()
            m.setMatrixAt(i++, mat.copy(o.matrix))
          }
        }
        for (const face of [1, -1]) {
          for (let k = 0; k < 4; k++) {
            o.position.set(cx + (W / 2 + 0.05) * face, y, -D / 2 + (D / 4) * (k + 0.5))
            o.rotation.set(0, Math.PI / 2, 0)
            o.updateMatrix()
            m.setMatrixAt(i++, mat.copy(o.matrix))
            o.rotation.set(0, 0, 0)
          }
        }
      }
    }
    m.instanceMatrix.needsUpdate = true
  }, [pav, torres])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, total]}>
      <boxGeometry args={[2.2, 1.5, 0.1]} />
      <meshStandardMaterial color="#8FD3E8" emissive="#3a8fb0" emissiveIntensity={0.25} />
    </instancedMesh>
  )
}

interface CenaProps {
  obra: Obra
  estacao: Estacao
  hora: number
  fachada: Fachada
  pav: number
}

function Cena({ obra, estacao, hora, fachada, pav }: CenaProps) {
  const torres = Math.min(3, obra.torres ?? 1)
  const feitos = Math.round((pav * (obra.obra ?? 0)) / 100)
  const sol = posicaoSol(estacao, hora)
  const v = vetorSol(sol)
  const dia = sol.alt > 0
  const luz = useRef<DirectionalLight>(null)
  const dist = 140
  const theta = Math.PI - (AZ_FACHADA[fachada] * Math.PI) / 180

  const arco = useMemo(() => {
    const { nasce, poe } = nascerEPor(estacao)
    const pts: [number, number, number][] = []
    for (let t = nasce; t <= poe; t += 0.25) {
      const vv = vetorSol(posicaoSol(estacao, t))
      pts.push([vv[0] * 110, vv[1] * 110, vv[2] * 110])
    }
    return pts
  }, [estacao])

  useFrame(() => {
    if (luz.current) luz.current.position.set(v[0] * dist, Math.max(v[1], 0.02) * dist, v[2] * dist)
  })

  const alturaTotal = pav * H
  const andaresConcluidos = obra.fase === 'Pronto' ? pav : feitos

  return (
    <>
      <color attach="background" args={[dia ? '#BFD9EA' : '#0B1A2B']} />
      <ambientLight intensity={dia ? 0.55 : 0.18} />
      <directionalLight ref={luz} intensity={dia ? 2.4 : 0} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-120} shadow-camera-right={120} shadow-camera-top={120} shadow-camera-bottom={-120} shadow-camera-far={400} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[130, 64]} />
        <meshStandardMaterial color={dia ? '#9DB59F' : '#2b4438'} />
      </mesh>
      {(['N', 'L', 'S', 'O'] as Fachada[]).map((f) => {
        const a = (AZ_FACHADA[f] * Math.PI) / 180
        return (
          <Html key={f} position={[Math.sin(a) * 118, 2, -Math.cos(a) * 118]} center style={{ pointerEvents: 'none' }}>
            <span className={`bussola ${f === 'N' ? 'norte' : ''}`}>{f}</span>
          </Html>
        )
      })}
      {arco.length > 1 && <Line points={arco} color="#FFC72C" lineWidth={2} dashed dashSize={4} gapSize={3} />}
      {dia && (
        <mesh position={[v[0] * 110, v[1] * 110, v[2] * 110]}>
          <sphereGeometry args={[4, 24, 24]} />
          <meshBasicMaterial color="#FFE08A" />
        </mesh>
      )}

      <group rotation={[0, theta, 0]}>
        {Array.from({ length: torres }).map((_, t) => {
          const cx = (t - (torres - 1) / 2) * (W + 10)
          return (
            <group key={t} position={[cx, 0, 0]}>
              <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[W + 8, 3, D + 8]} />
                <meshStandardMaterial color="#C9D3DC" />
              </mesh>
              {andaresConcluidos > 0 && (
                <mesh position={[0, 3 + (andaresConcluidos * H) / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[W, andaresConcluidos * H, D]} />
                  <meshStandardMaterial color="#F2F4F6" />
                </mesh>
              )}
              {andaresConcluidos < pav && (
                <mesh position={[0, 3 + andaresConcluidos * H + ((pav - andaresConcluidos) * H) / 2, 0]}>
                  <boxGeometry args={[W, (pav - andaresConcluidos) * H, D]} />
                  <meshStandardMaterial color="#FFC72C" transparent opacity={0.22} wireframe />
                </mesh>
              )}
              <mesh position={[0, 3 + alturaTotal + 0.4, 0]} castShadow>
                <boxGeometry args={[W + 1, 0.8, D + 1]} />
                <meshStandardMaterial color="#0A2540" />
              </mesh>
              <mesh position={[3, 3 + alturaTotal + 1, 2]}>
                <boxGeometry args={[9, 0.3, 5]} />
                <meshStandardMaterial color="#35B6D8" />
              </mesh>
            </group>
          )
        })}
        <group position={[0, 3, 0]}>
          <Janelas pav={Math.max(andaresConcluidos, 1)} torres={torres} />
        </group>
        <Html position={[(torres * (W + 10)) / 2 + 4, 3 + alturaTotal, 0]} style={{ pointerEvents: 'none' }}>
          <span className="rotulo-3d">{pav} pav.</span>
        </Html>
      </group>

      <OrbitControls makeDefault enablePan={false} minDistance={40} maxDistance={320} maxPolarAngle={Math.PI / 2.02} target={[0, Math.min(alturaTotal / 2.4, 60), 0]} />
    </>
  )
}

export default function TowerStudy({ obra }: { obra: Obra }) {
  const [estacao, setEstacao] = useState<Estacao>('verao')
  const [hora, setHora] = useState(14)
  const [fachada, setFachada] = useState<Fachada>('N')
  const [anima, setAnima] = useState(false)
  const pavReal = obra.pav != null
  const pav = obra.pav ?? PAV_ESTIMADO

  useEffect(() => {
    if (!anima) return
    const id = setInterval(() => setHora((h) => (h >= 19 ? 5 : h + 0.1)), 60)
    return () => clearInterval(id)
  }, [anima])

  const sol = posicaoSol(estacao, hora)
  const tabela = useMemo(
    () =>
      (['verao', 'inverno'] as Estacao[]).map((e) => ({
        e,
        h: (['N', 'L', 'S', 'O'] as Fachada[]).map((f) => ({ f, h: horasDeSol(e, AZ_FACHADA[f]) })),
      })),
    [],
  )
  const hh = (x: number) => `${Math.floor(x)}h${String(Math.round((x % 1) * 60)).padStart(2, '0')}`

  return (
    <div className="studio">
      <div className="studio-canvas">
        <Canvas shadows camera={{ position: [95, 70, 120], fov: 38, near: 1, far: 1200 }} dpr={[1, 2]}>
          <Cena obra={obra} estacao={estacao} hora={hora} fachada={fachada} pav={pav} />
        </Canvas>
        <div className="studio-hud">
          Sol: altura {Math.max(0, Math.round(sol.alt))}° · azimute {Math.round(sol.az)}° {sol.alt <= 0 ? '(noite)' : ''}
        </div>
      </div>
      <div className="studio-ctl">
        <div className="seg" role="group" aria-label="Estação">
          {(Object.keys(ESTACOES) as Estacao[]).map((e) => (
            <button key={e} type="button" className={estacao === e ? 'on' : ''} onClick={() => setEstacao(e)}>
              {ESTACOES[e].rotulo} <small>{ESTACOES[e].data}</small>
            </button>
          ))}
        </div>
        <label className="hora">
          Hora solar <b>{hh(hora)}</b>
          <input type="range" min={4} max={20} step={0.1} value={hora} onChange={(ev) => setHora(Number(ev.target.value))} />
        </label>
        <div className="seg" role="group" aria-label="Fachada principal voltada para">
          <span className="seg-rot">Fachada principal para:</span>
          {(['N', 'L', 'S', 'O'] as Fachada[]).map((f) => (
            <button key={f} type="button" className={fachada === f ? 'on' : ''} onClick={() => setFachada(f)}>
              {f === 'N' ? 'Norte' : f === 'L' ? 'Leste' : f === 'S' ? 'Sul' : 'Oeste'}
            </button>
          ))}
          <button type="button" className={anima ? 'on' : ''} onClick={() => setAnima((a) => !a)}>
            {anima ? '■ Parar dia' : '▶ Animar dia'}
          </button>
        </div>
        <table className="sol-tab">
          <thead>
            <tr>
              <th>Horas de sol direto</th>
              <th>Norte</th>
              <th>Leste</th>
              <th>Sul</th>
              <th>Oeste</th>
            </tr>
          </thead>
          <tbody>
            {tabela.map((r) => (
              <tr key={r.e}>
                <td>{ESTACOES[r.e].rotulo}</td>
                {r.h.map((c) => (
                  <td key={c.f} className={c.f === fachada ? 'dest' : ''}>
                    {c.h.toFixed(1)} h
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mini">
          No hemisfério sul a face <b>norte</b> pega sol baixo no inverno (aquece e ilumina) e pouco no verão: é a mais valorizada. A face <b>oeste</b> sofre a tarde quente de
          verão; a <b>sul</b> quase não recebe sol direto no inverno. Cálculo para a latitude de Porto Belo/Itapema, sem sombra de vizinhos.
        </p>
        {!pavReal && <p className="mini aviso">Pavimentos não publicados: o desenho usa {PAV_ESTIMADO} andares só como ilustração.</p>}
      </div>
    </div>
  )
}
