import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import type { Group } from 'three'
import type { Obra } from './data.ts'
import { pontuar } from './score.ts'

const COR = { A: '#FFC72C', B: '#1B8A9A', C: '#7C8EA3' } as const
const PAV_ESTIMADO = 14

interface Props {
  obras: Obra[]
  centro: { lat: number; lng: number }
  /** multiplica pegada e altura para o prédio aparecer em escalas maiores (Itapema) */
  escala: number
  selecionada: string | null
  onSelecionar: (id: string) => void
  giraComScroll?: boolean
  acesso?: { lat: number; lng: number }
  raio: number
}

function metros(lat: number, lng: number, c: { lat: number; lng: number }) {
  return { x: (lng - c.lng) * 111320 * Math.cos((c.lat * Math.PI) / 180), z: -(lat - c.lat) * 110540 }
}

function Giro({ ativo, children }: { ativo: boolean; children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame(() => {
    if (ref.current && ativo) ref.current.rotation.y = window.scrollY * 0.0016
  })
  return <group ref={ref}>{children}</group>
}

export default function Masterplan({ obras, centro, escala, selecionada, onSelecionar, giraComScroll, acesso, raio }: Props) {
  const [hover, setHover] = useState<string | null>(null)
  const itens = useMemo(
    () =>
      obras.map((o) => {
        const p = pontuar(o)
        const pav = o.pav ?? PAV_ESTIMADO
        return { o, p, pav, pos: metros(o.lat, o.lng, centro) }
      }),
    [obras, centro],
  )
  const ac = acesso ? metros(acesso.lat, acesso.lng, centro) : null
  const w = 26 * escala
  const d = 20 * escala

  return (
    <Canvas shadows camera={{ position: [raio * 0.9, raio * 0.75, raio * 0.9], fov: 38, near: 1, far: raio * 30 }} dpr={[1, 2]}>
      <color attach="background" args={['#0A2540']} />
      <fog attach="fog" args={['#0A2540', raio * 2.4, raio * 6]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[raio, raio * 1.6, raio * 0.4]} intensity={1.7} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-raio * 1.6} shadow-camera-right={raio * 1.6} shadow-camera-top={raio * 1.6} shadow-camera-bottom={-raio * 1.6} shadow-camera-far={raio * 6} />
      <Giro ativo={!!giraComScroll}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[raio * 2, 64]} />
          <meshStandardMaterial color="#123659" />
        </mesh>
        <gridHelper args={[raio * 4, 40, '#2c5a8a', '#1a456e']} position={[0, 0.2, 0]} />
        {ac && (
          <group position={[ac.x, 0, ac.z]}>
            <mesh position={[0, 8 * escala, 0]} castShadow>
              <coneGeometry args={[4 * escala, 16 * escala, 4]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#ffffff" emissiveIntensity={0.4} />
            </mesh>
            <Html position={[0, 22 * escala, 0]} center style={{ pointerEvents: 'none' }}>
              <span className="rotulo-3d rotulo-acesso">Acesso VivaPark</span>
            </Html>
          </group>
        )}
        {itens.map(({ o, p, pav, pos }) => {
          const h = pav * 3 * escala
          const sel = selecionada === o.id
          return (
            <group key={o.id} position={[pos.x, 0, pos.z]}>
              <mesh
                position={[0, h / 2, 0]}
                castShadow
                onClick={(e) => {
                  if (e.delta > 4) return
                  e.stopPropagation()
                  onSelecionar(o.id)
                }}
                onPointerOver={(e) => {
                  e.stopPropagation()
                  setHover(o.id)
                  document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                  setHover(null)
                  document.body.style.cursor = ''
                }}
              >
                <boxGeometry args={[w, h, d]} />
                <meshStandardMaterial color={COR[p.tier]} emissive={sel ? '#ffffff' : COR[p.tier]} emissiveIntensity={sel ? 0.55 : hover === o.id ? 0.35 : 0.08} opacity={o.pav == null ? 0.82 : 1} transparent={o.pav == null} />
              </mesh>
              {(sel || hover === o.id || p.tier === 'A') && (
                <Html position={[0, h + 6 * escala, 0]} center style={{ pointerEvents: 'none' }}>
                  <span className={`rotulo-3d ${sel ? 'sel' : ''}`}>
                    {o.nome} · {p.tier} · {Math.round(p.total)}
                  </span>
                </Html>
              )}
            </group>
          )
        })}
      </Giro>
      <OrbitControls makeDefault enablePan={false} autoRotate={!giraComScroll} autoRotateSpeed={0.45} minDistance={raio * 0.4} maxDistance={raio * 3} maxPolarAngle={Math.PI / 2.05} />
    </Canvas>
  )
}
