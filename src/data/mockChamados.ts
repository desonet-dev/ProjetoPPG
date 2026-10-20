import type { Chamado } from '../types/chamado.ts';

function diasAtras(dias: number, hora = 15, minuto = 35): string {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  data.setHours(hora, minuto, 0, 0);
  return data.toISOString();
}

/**
 * Dados de exemplo para desenvolver a tela sem depender do back-end ainda.
 * Troque esta lista por uma chamada ao Firestore/API quando estiver pronta.
 */
export const mockChamados: Chamado[] = [
  {
    id: '1',
    protocolo: '2026-0005',
    assunto: 'Monitor ruim',
    mensagem:
      'Olá Secretaria,\n\n' +
      'O monitor da sala 08 está com mal funcionamento durante a minha aula. A imagem fica piscando e às vezes desliga sozinho.\n\n' +
      'Preciso que isso seja resolvido o quanto antes, pois uso o computador para dar aula.',
    solicitanteNome: 'Nathane de Castro',
    solicitanteIniciais: 'NC',
    local: 'Sala 08',
    categoria: 'computador',
    gravidade: 'alta',
    status: 'aberto',
    abertoEm: diasAtras(1),
    destinatario: 'Brenda',
    lido: true
  },
  {
    id: '2',
    protocolo: '2026-0004',
    assunto: 'Problema na rede',
    mensagem:
      'Bom dia,\n\n' +
      'A internet está funcionando em apenas metade da sala e a outra parte está com o sinal muito baixo.\n\n' +
      'Isso está atrapalhando a atividade que envolve o uso dos computadores.',
    solicitanteNome: 'Alicia Stefany',
    solicitanteIniciais: 'AS',
    local: 'Lab. 02',
    categoria: 'internet',
    gravidade: 'media',
    status: 'aberto',
    abertoEm: diasAtras(1, 10, 12),
    destinatario: 'Brenda',
    lido: false
  },
  {
    id: '3',
    protocolo: '2026-0003',
    assunto: 'Teclado quebrado',
    mensagem:
      'Fui fazer chamada na sala 05 e o teclado do computador não estava saindo o botão SPACE, e por isso não consegui fazer a chamada do dia.\n\n' +
      'Fechei a sala para que não usem o computador, mas preciso que isso seja resolvido o quanto antes.',
    solicitanteNome: 'Marcelo Zollo',
    solicitanteIniciais: 'MZ',
    local: 'Sala 05',
    categoria: 'computador',
    gravidade: 'media',
    status: 'aberto',
    abertoEm: diasAtras(1, 9, 48),
    destinatario: 'Brenda',
    lido: false
  },
  {
    id: '4',
    protocolo: '2026-0002',
    assunto: 'Projetor irregular',
    mensagem:
      'Fui fazer a pré-banca com meus alunos e o pezinho do projetor está torto, o que deixa a projeção toda tombada para um lado.\n\n' +
      'Dá pra usar, mas atrapalha bastante a visualização dos slides.',
    solicitanteNome: 'Nathane de Castro',
    solicitanteIniciais: 'NC',
    local: 'Lab. 02',
    categoria: 'projetor',
    gravidade: 'baixa',
    status: 'aberto',
    abertoEm: diasAtras(1, 8, 20),
    destinatario: 'Brenda',
    lido: false
  },
  {
    id: '5',
    protocolo: '2026-0001',
    assunto: 'Monitor ruim',
    mensagem:
      'Monitor com mal funcionamento em minha aula na sala localizada na sala 08.\n\n' +
      'A imagem fica com listras verticais na parte de baixo da tela.',
    solicitanteNome: 'Nathane de Castro',
    solicitanteIniciais: 'NC',
    local: 'Sala 08',
    categoria: 'computador',
    gravidade: 'media',
    status: 'aberto',
    abertoEm: diasAtras(2),
    destinatario: 'Brenda',
    lido: true
  }
];
