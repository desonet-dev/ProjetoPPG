/**
 * Locais/salas cadastrados no sistema. Por enquanto é só uma lista fixa;
 * quando o Firestore entrar aqui, vira a coleção "locais" e esse arquivo
 * desaparece. O importante é que QUALQUER lugar do app que precise listar
 * locais (abrir chamado, filtros de relatório, configurações) leia daqui,
 * pra nunca ficar desalinhado.
 */
export const mockLocais: string[] = [
  'Bloco A',
  'Bloco B',
  'Lab. 01',
  'Lab. 02',
  'Lab. 03',
  'Sala 05',
  'Sala 08',
  'Sala 09',
  'Sala Maker'
];