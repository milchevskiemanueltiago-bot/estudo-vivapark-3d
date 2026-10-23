export type Regiao = 'vivapark' | 'entorno' | 'itapema'
export type Fase = 'Pré-lançamento' | 'Em obra' | 'Pronto' | 'Futuro lançamento'

export interface Obra {
  id: string
  nome: string
  c: string
  g: Regiao
  bairro: string
  lat: number
  lng: number
  end: string
  fase: Fase
  obra: number | null
  ent: string | null
  pav: number | null
  torres: number | null
  q: string
  areas: string
  disp: number | null
  ap: number | null
  area: number | null
  pm2: number | null
  tipo: string | null
  ri: boolean | null
  lazer: string[]
  lm2: number | null
  /** nota de localização/entorno de 0 a 100 (julgamento nosso, explicado em loc.nota) */
  loc: number
  nota: string
}

export const REGIOES: Record<Regiao, string> = {
  vivapark: 'VivaPark · Porto Belo',
  entorno: 'Entorno · Porto Belo',
  itapema: 'Itapema · Meia Praia e arredores',
}

/** Construtoras: entregues e em obra segundo o painel de incorporadoras do DWV (22/10/2026). Ausente = sem dado. */
export const HISTORICO: Record<string, { entregues: number; emObra: number }> = {
  Torresani: { entregues: 61, emObra: 5 },
  Vokkan: { entregues: 5, emObra: 5 },
  'AP | Pasqualotto': { entregues: 30, emObra: 31 },
  Pasqualotto: { entregues: 30, emObra: 31 },
  Urbaniza: { entregues: 7, emObra: 6 },
  Sul: { entregues: 7, emObra: 7 },
  Santana: { entregues: 10, emObra: 5 },
  MS: { entregues: 14, emObra: 11 },
  'AGV Selent': { entregues: 5, emObra: 8 },
  N1: { entregues: 12, emObra: 6 },
  MC: { entregues: 9, emObra: 18 },
}

export const OBRAS: Obra[] = [
  // ---------- VIVAPARK ----------
  { id: 'vitta27', nome: 'Vitta 27 (Torres 1 e 2)', c: 'Vokkan / Famex', g: 'vivapark', bairro: 'VivaPark', lat: -27.1626, lng: -48.6022, end: 'Rua Hortência, 45', fase: 'Pré-lançamento', obra: 0, ent: '2031-03', pav: null, torres: 2, q: '1 a 3 quartos', areas: '64 a 199 m²', disp: 157, ap: 812643, area: 37, pm2: 21963, tipo: 'Escritório (studio 32 m² a R$ 855.241)', ri: false, lazer: ['Coworking', 'Lavanderia compartilhada', 'Brinquedoteca', 'Academia', 'Espaço gourmet', 'Pilates', 'Salão de festas', 'Piscina externa e coberta', 'Spa, sauna e massagem', 'Mirante', 'Bicicletário'], lm2: null, loc: 88, nota: 'Torre 2 prevista mar/2031 e Torre 1 mar/2032. Pré-reserva sem Registro de Incorporação.' },
  { id: 'verenna', nome: 'Verenna', c: 'Vokkan / Conrado', g: 'vivapark', bairro: 'VivaPark', lat: -27.1551, lng: -48.5899, end: 'Av. Colombo Machado Sales, 1480', fase: 'Pré-lançamento', obra: 0, ent: '2030-10', pav: 33, torres: 2, q: '2 a 4 quartos', areas: '64 a 133 m²', disp: 61, ap: 1122207, area: 64, pm2: 17534, tipo: '1 suíte + 2 demi', ri: false, lazer: ['Mais de 2.700 m² de lazer', 'Piscinas externa e térmica', 'Academia e spa', 'Pub', 'Salões de festas', 'Coworking', 'Áreas gourmet', 'Horta comunitária', 'Rooftop'], lm2: 2700, loc: 84, nota: '197 apartamentos + 7 salas; 36.312 m² construídos; projeto OSPA. Pré-reserva sem Registro de Incorporação.' },
  { id: 'valence', nome: 'Valence Residence', c: 'Vokkan', g: 'vivapark', bairro: 'VivaPark', lat: -27.1618, lng: -48.6008, end: 'VivaPark (endereço não publicado)', fase: 'Pré-lançamento', obra: 0, ent: null, pav: null, torres: null, q: '1 suíte + 1 dorm. a 2 suítes', areas: '73 a 77 m²', disp: 130, ap: 1137560, area: 73, pm2: 15583, tipo: '1 suíte + 1 dorm.', ri: null, lazer: [], lm2: null, loc: 88, nota: 'Sem ficha pública nos portais; preço do DWV.' },
  { id: 'ventura', nome: 'Edifício Ventura', c: 'Vokkan / Torresani', g: 'vivapark', bairro: 'VivaPark', lat: -27.1618, lng: -48.6041, end: 'Av. Silvio Camargo', fase: 'Pré-lançamento', obra: 0, ent: '2028-04', pav: null, torres: null, q: '2 a 3 quartos', areas: 'a partir de 61 m²', disp: 12, ap: 1234703, area: 61, pm2: 20241, tipo: '1 suíte + 1 dorm. + sacada', ri: null, lazer: ['Piscina e prainha', 'Ofurôs', 'Espaços gourmet', 'Playground e kids', 'Academia (interna e ao ar livre)', 'Fireplaces e sauna', 'Rooftop panorâmico'], lm2: null, loc: 92, nota: 'Ao lado do acesso principal do VivaPark.' },
  { id: 'vision', nome: 'Vision Home Club (fases 1 a 3)', c: 'Vokkan / N1', g: 'vivapark', bairro: 'VivaPark', lat: -27.1596, lng: -48.5968, end: 'Av. Pedro Elias Rodrigues', fase: 'Pré-lançamento', obra: 0, ent: '2030-12', pav: null, torres: null, q: '2 a 4 quartos', areas: '96 a 239 m²', disp: 80, ap: 1491720, area: 96, pm2: 15539, tipo: 'T1 3 suítes + sacada', ri: null, lazer: ['5.800 m² de lazer', 'Piscinas com bar e lounge', 'Saunas', 'Quadra poliesportiva', 'Academia com pilates e yoga', 'Salão de festas'], lm2: 5800, loc: 84, nota: 'Fase 1 dez/2030, fase 2 dez/2031, fase 3 dez/2032.' },
  { id: 'veccel', nome: 'Veccel Corporate', c: 'Vokkan / Eccel', g: 'vivapark', bairro: 'VivaPark', lat: -27.1612, lng: -48.6035, end: 'VivaPark (endereço não publicado)', fase: 'Pré-lançamento', obra: 0, ent: '2030-06', pav: null, torres: null, q: 'Salas comerciais', areas: 'a partir de 27 m²', disp: 42, ap: 652705, area: 27, pm2: 24174, tipo: 'Sala comercial', ri: null, lazer: [], lm2: null, loc: 88, nota: 'Corporativo: renda por locação comercial, não por temporada.' },
  { id: 'veleiros', nome: 'Veleiros Residence', c: 'Vokkan / Torresani', g: 'vivapark', bairro: 'VivaPark', lat: -27.1638, lng: -48.603, end: 'Av. Pedro Elias Rodrigues, 1', fase: 'Em obra', obra: 13, ent: '2030-04', pav: null, torres: 3, q: '1 e 2 quartos (loft, duplex)', areas: '44 a 179 m²', disp: 54, ap: 1197971, area: 51, pm2: 23490, tipo: 'T3 2 suítes duplex + sacada', ri: null, lazer: ['3.600 m² de lazer em rooftops', 'Piscina de 22 m', 'Academia, yoga, pilates, sauna', 'Sport bar e fireplace', 'Churrasqueira em todos os apartamentos'], lm2: 3600, loc: 86, nota: 'Três torres (Porto, Cais e Farol).' },
  { id: 'videiras', nome: 'Edifício Videiras', c: 'Vokkan / Torresani', g: 'vivapark', bairro: 'VivaPark', lat: -27.1614, lng: -48.5996, end: 'Av. Pedro Elias Rodrigues', fase: 'Em obra', obra: 15, ent: '2028-09', pav: 30, torres: 1, q: '3 quartos', areas: '118 a 198 m²', disp: 21, ap: 2656199, area: 121, pm2: 21952, tipo: '3 suítes + sacada', ri: null, lazer: ['Piscina aquecida', 'Espaço gourmet', 'Academia', 'Wine bar e charutaria', 'Brinquedoteca', 'Prainha', 'Rooftop com vista', 'Espaço zen com mirante', 'Fireplace e braseiro'], lm2: null, loc: 86, nota: '30 pavimentos, 24 residenciais.' },
  { id: 'voz', nome: 'Edifício Voz', c: 'Vokkan / Torresani', g: 'vivapark', bairro: 'VivaPark', lat: -27.1648, lng: -48.6018, end: 'Av. Silvio Camargo / Av. Azaleia', fase: 'Em obra', obra: 44, ent: '2027-10', pav: 18, torres: 1, q: 'Studio a 1 quarto', areas: '21 a 124 m²', disp: 7, ap: 717894, area: 29, pm2: 24755, tipo: 'Studio', ri: null, lazer: ['2.100 m² de lazer em 6 pavimentos', 'Solarium e piscina com quebra-gelo', 'Prainha', 'Bar da piscina', 'Ofurôs', 'Spa com sauna e massagem'], lm2: 2100, loc: 90, nota: 'Aparece no mapa do Google do VivaPark.' },
  { id: 'vertice', nome: 'Edifício Vértice', c: 'Vokkan / Torresani', g: 'vivapark', bairro: 'VivaPark', lat: -27.1632, lng: -48.6022, end: 'Av. Gov. Celso Ramos / R. Hortência', fase: 'Em obra', obra: 60, ent: '2027-06', pav: null, torres: null, q: '1 suíte (89 a 157 m²)', areas: '89 a 157 m²', disp: 13, ap: 1827918, area: 88, pm2: 20772, tipo: '1 suíte + piscina', ri: null, lazer: ['Open shopping no térreo', 'Coworking e lavanderia', 'Pub, bar e café bar', 'Estúdio de gravação', 'Piscinas adulto, infantil, aquecida e coberta', 'Academia, spa, sauna, ofurô', 'Salão de festas e jogos', 'Gourmet e brinquedoteca'], lm2: null, loc: 92, nota: 'Portal: a partir de R$ 2,07–2,13 mi (planta de 101 m²).' },
  { id: 'vista', nome: 'Edifício Vista Jardins', c: 'Vokkan / Torresani', g: 'vivapark', bairro: 'VivaPark', lat: -27.1601, lng: -48.606, end: 'Av. Gov. Celso Ramos', fase: 'Em obra', obra: 95, ent: '2026-06', pav: null, torres: null, q: '3 suítes, 3 vagas', areas: '172 a 400 m²', disp: 10, ap: 3211031, area: 172, pm2: 18669, tipo: '3 suítes', ri: null, lazer: ['3.000 m² de lazer', 'Piscina aquecida, adulto e infantil', 'Academia, sauna, massagem', 'Quadra esportiva', 'Salão de festas, jogos, gourmet', 'Brinquedoteca e playground', 'Pub, solarium, fireplace'], lm2: 3000, loc: 90, nota: 'Portal: pronto para morar. DWV: obra a 95%.' },
  { id: 'inc31', nome: 'Vivapark INC 31', c: 'Vokkan', g: 'vivapark', bairro: 'VivaPark', lat: -27.1634, lng: -48.6011, end: 'Rua Magnólia', fase: 'Futuro lançamento', obra: 0, ent: '2032-04', pav: null, torres: null, q: '1 quarto (loft duplex)', areas: '46 a 48 m²', disp: null, ap: null, area: 46, pm2: null, tipo: null, ri: null, lazer: [], lm2: null, loc: 90, nota: 'Sem preço divulgado.' },
  { id: 'olivea', nome: 'Casa Olivea', c: 'Urbaniza', g: 'vivapark', bairro: 'VivaPark', lat: -27.1645, lng: -48.6062, end: 'VivaPark (loteamento de casas)', fase: 'Em obra', obra: 45, ent: '2027-04', pav: 2, torres: 1, q: 'Casa 4 suítes', areas: '351 m²', disp: 1, ap: 6800000, area: 351, pm2: 19373, tipo: 'Casa 4 suítes', ri: null, lazer: [], lm2: null, loc: 86, nota: 'Casa em loteamento (terrenos de 360 a 716 m²).' },
  // ---------- ENTORNO PORTO BELO ----------
  { id: 'artis', nome: 'Artis Home Club', c: 'Pasqualotto', g: 'entorno', bairro: 'Perequê / Jardim Dourado', lat: -27.15645, lng: -48.59308, end: 'Rua Rudy Arnaldo Hintz', fase: 'Em obra', obra: 9, ent: null, pav: null, torres: 2, q: '2 e 3 quartos', areas: '69 a 73 m²', disp: null, ap: 1130000, area: 68.51, pm2: 16494, tipo: '3 dorm.', ri: null, lazer: ['3.300 m² de lazer', 'Piscinas internas e externas', 'Sauna e massagem', 'Academia e pilates', '5 salões de festas', 'Quadra poliesportiva', 'Playground e pet'], lm2: 3300, loc: 68, nota: '6 apartamentos por andar em cada torre.' },
  { id: 'lyon', nome: 'Lyon Home Club', c: 'Pasqualotto', g: 'entorno', bairro: 'Perequê', lat: -27.1561, lng: -48.5745, end: 'Rua Felipe Sestren', fase: 'Em obra', obra: 2, ent: null, pav: null, torres: 2, q: '2 e 3 quartos', areas: '69 a 74 m²', disp: null, ap: 948000, area: 65.94, pm2: 14377, tipo: '2 dorm.', ri: null, lazer: ['2.140 m² de lazer', 'Piscina de 72 m', 'Quadra poliesportiva', 'Espaço pet de 220 m²', 'Sacada com churrasqueira'], lm2: 2140, loc: 70, nota: 'A ~200 m da praia do Perequê (portal).' },
  { id: 'gan', nome: 'Residencial Ilha de Gan', c: 'Urbaniza', g: 'entorno', bairro: 'Jardim Dourado', lat: -27.15484, lng: -48.59483, end: 'Rua José Miguel Pedro, 540', fase: 'Em obra', obra: 94, ent: '2026-12', pav: null, torres: null, q: '2 quartos (1 suíte)', areas: '72 a 73 m²', disp: null, ap: 850000, area: 72.72, pm2: 11689, tipo: '2 dorm.', ri: null, lazer: ['Salão de festas', 'Rooftop', 'Espaço gourmet'], lm2: null, loc: 66, nota: 'Quase pronto: pouco ganho de obra restante.' },
  { id: 'luz', nome: 'Luz de Valéria', c: 'Sul', g: 'entorno', bairro: 'Alto Perequê', lat: -27.13868, lng: -48.60888, end: 'Av. Ayrton Andorinha, 572', fase: 'Pré-lançamento', obra: 0, ent: '2030-12', pav: 20, torres: 1, q: '2 e 3 quartos', areas: '74 a 228 m²', disp: null, ap: 1036517, area: 74, pm2: 14007, tipo: '2 dorm.', ri: null, lazer: ['900 m² de lazer', 'Piscina, academia e spa', 'Rooftop com pub e salão', 'Sacada com churrasqueira'], lm2: 900, loc: 60, nota: '5 apartamentos por andar.' },
  { id: 'aime', nome: 'Aimè Residence', c: 'Sul', g: 'entorno', bairro: 'Perequê', lat: -27.155, lng: -48.5888, end: 'Rua São Paulo, 05', fase: 'Em obra', obra: 24, ent: null, pav: null, torres: null, q: '2 quartos', areas: '83 m²', disp: null, ap: 984058, area: 83.39, pm2: 11801, tipo: '2 dorm.', ri: null, lazer: ['Piscina adulta e infantil', 'Academia', 'Brinquedoteca', 'Espaço gourmet'], lm2: null, loc: 66, nota: '' },
  { id: 'sardenha', nome: 'Ilha de Sardenha', c: 'Santana', g: 'entorno', bairro: 'Perequê', lat: -27.1566, lng: -48.574, end: 'Rua Felipe Sestren', fase: 'Em obra', obra: 12, ent: '2029-12', pav: null, torres: null, q: '2 quartos', areas: '82 m²', disp: null, ap: 1233892, area: 82.21, pm2: 15009, tipo: '2 dorm.', ri: null, lazer: [], lm2: null, loc: 70, nota: 'Endereço varia entre portais.' },
  { id: 'lagom', nome: 'Lagom Perequê', c: 'GT Home / ABC', g: 'entorno', bairro: 'Perequê', lat: -27.1556, lng: -48.575, end: 'Av. Colombo Machado Sales', fase: 'Pré-lançamento', obra: 0, ent: '2028-12', pav: null, torres: 6, q: '1 a 4 quartos', areas: '40 a 199 m²', disp: 31, ap: 1008103, area: 41.31, pm2: 24403, tipo: '1 dorm.', ri: null, lazer: ['Piscinas aquecida, coberta e borda infinita', 'Sauna e spa', 'Academia', 'Quadras (esportiva, beach tennis, basquete)', 'Coworking', 'Pista de caminhada'], lm2: null, loc: 72, nota: '6 torres; ~200 m da praia do Perequê.' },
  { id: 'msmart', nome: 'MS Smart', c: 'MS', g: 'entorno', bairro: 'Vila Nova', lat: -27.16725, lng: -48.57022, end: 'Rua Pedro Guerreiro', fase: 'Em obra', obra: 52, ent: '2026-06', pav: null, torres: null, q: '2 quartos', areas: '57 m²', disp: null, ap: 695377, area: 57.14, pm2: 12170, tipo: '2 dorm.', ri: null, lazer: [], lm2: null, loc: 60, nota: 'Entrega do portal: jun/2026.' },
  { id: 'arvoredo', nome: 'Reserva do Arvoredo Home Club', c: 'Profor', g: 'entorno', bairro: 'Perequê', lat: -27.15503, lng: -48.56953, end: 'Rua Rio Perequê', fase: 'Em obra', obra: null, ent: '2026-12', pav: null, torres: null, q: '2 e 3 quartos', areas: '92 a 126 m²', disp: null, ap: 1960000, area: null, pm2: null, tipo: null, ri: null, lazer: [], lm2: null, loc: 72, nota: 'Só portal (fora do DWV): a partir de R$ 1,96 mi.' },
  // ---------- ITAPEMA ----------
  { id: 'vitreo271', nome: 'Vitreo 271', c: 'ABC.inc', g: 'itapema', bairro: 'Meia Praia', lat: -27.13448, lng: -48.59649, end: 'Rua 271', fase: 'Em obra', obra: 15, ent: '2028-07', pav: null, torres: null, q: '4 dormitórios', areas: 'a partir de 178 m²', disp: 9, ap: 4721028, area: 178, pm2: 26523, tipo: '4 dorm.', ri: null, lazer: [], lm2: null, loc: 84, nota: 'Alto padrão (casa sobre a laje, piscina privativa segundo portal).' },
  { id: 'greenville', nome: 'Green Ville', c: 'AP | Pasqualotto', g: 'itapema', bairro: 'Meia Praia', lat: -27.13535, lng: -48.60413, end: 'Rua 268', fase: 'Em obra', obra: 23, ent: '2030-12', pav: 31, torres: 3, q: '3 dormitórios', areas: 'a partir de 100 m²', disp: null, ap: 1442000, area: 100.88, pm2: 14294, tipo: '3 dorm.', ri: null, lazer: [], lm2: null, loc: 80, nota: '3 torres de 31 pavimentos e 324 apartamentos (portal, fase 3).' },
  { id: 'dublin', nome: 'Dublin Residence', c: 'AGV Selent', g: 'itapema', bairro: 'Meia Praia', lat: -27.12916, lng: -48.6045, end: 'Rua 246', fase: 'Em obra', obra: 40, ent: '2028-11', pav: null, torres: null, q: '3 suítes', areas: '~130 m²', disp: null, ap: 1819904, area: 131, pm2: 13892, tipo: '3 dorm.', ri: null, lazer: [], lm2: null, loc: 82, nota: 'Portal diz “sem Registro de Incorporação”; DWV mostra obra a 40%. Confirmar no cartório.' },
  { id: 'sanfelice', nome: 'San Felice Home Club', c: 'AP | Pasqualotto', g: 'itapema', bairro: 'Morretes', lat: -27.12693, lng: -48.61696, end: 'Rua 430', fase: 'Em obra', obra: 28, ent: '2028-12', pav: null, torres: 3, q: '2 quartos', areas: '67 m²', disp: null, ap: 907265, area: 67.05, pm2: 13531, tipo: '2 dorm.', ri: null, lazer: [], lm2: null, loc: 70, nota: '' },
  { id: 'stbarth', nome: 'St. Barth Home Club', c: 'AP | Pasqualotto', g: 'itapema', bairro: 'Morretes', lat: -27.1197, lng: -48.6168, end: 'Av. Marginal Oeste', fase: 'Em obra', obra: 18, ent: '2027-12', pav: null, torres: 2, q: '3 dormitórios', areas: '70 m²', disp: null, ap: 935500, area: 70, pm2: 13364, tipo: '3 dorm.', ri: null, lazer: [], lm2: null, loc: 68, nota: 'Início do km 149 da BR-101 (portal).' },
  { id: 'blueview', nome: 'Blue View', c: 'AP | Pasqualotto', g: 'itapema', bairro: 'Morretes', lat: -27.1164, lng: -48.6136, end: 'Rua 402', fase: 'Em obra', obra: 69, ent: '2026-12', pav: null, torres: null, q: '2 quartos', areas: '61 m²', disp: null, ap: 957000, area: 60.7, pm2: 15766, tipo: '—', ri: null, lazer: [], lm2: null, loc: 68, nota: 'Obra adiantada: entrega dez/2026 (portal).' },
  { id: 'prospere', nome: 'Prospère', c: 'Sul', g: 'itapema', bairro: 'Morretes', lat: -27.121, lng: -48.615, end: 'Morretes', fase: 'Em obra', obra: 12, ent: null, pav: null, torres: null, q: '2 quartos', areas: '70 m²', disp: null, ap: 801179, area: 70, pm2: 11445, tipo: '2 dorm.', ri: null, lazer: [], lm2: null, loc: 66, nota: 'A ~850 m da Meia Praia (portal).' },
  { id: 'cologny', nome: 'Cologny Residence', c: 'Santana', g: 'itapema', bairro: 'Tabuleiro dos Oliveiras', lat: -27.10637, lng: -48.61604, end: 'Rua 607', fase: 'Pré-lançamento', obra: 0, ent: '2029-12', pav: null, torres: null, q: '2 quartos', areas: '70 m²', disp: null, ap: 907181, area: 70, pm2: 12960, tipo: '2 dorm.', ri: null, lazer: [], lm2: null, loc: 64, nota: '' },
  { id: 'its', nome: "IT's", c: 'ABC.inc', g: 'itapema', bairro: 'Casa Branca', lat: -27.0899, lng: -48.6241, end: 'Rua 700', fase: 'Pré-lançamento', obra: 0, ent: '2031-01', pav: null, torres: null, q: '1 dormitório', areas: '50 m²', disp: 63, ap: 762140, area: 50, pm2: 15243, tipo: '1 dorm.', ri: null, lazer: [], lm2: null, loc: 68, nota: '' },
  { id: 'mayfair', nome: '143 Mayfair', c: 'ABC.inc', g: 'itapema', bairro: 'Centro', lat: -27.099, lng: -48.615, end: 'Rua 143', fase: 'Pronto', obra: 100, ent: '2025-09', pav: null, torres: null, q: '4 dormitórios', areas: '150 m²', disp: 5, ap: 4397318, area: 150, pm2: 29315, tipo: '4 dorm.', ri: true, lazer: [], lm2: null, loc: 80, nota: 'Pronto: referência de teto de preço do Centro.' },
]

/** Posição do VivaPark (link do Google Maps enviado): acesso principal. */
export const VIVAPARK_ACESSO = { lat: -27.1610804, lng: -48.6043109 }
export const MEIA_PRAIA_CENTRO = { lat: -27.1275, lng: -48.6035 }
