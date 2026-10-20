export type StatusChamado = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';

export type GravidadeChamado = 'baixa' | 'media' | 'alta' | 'critica';

export type CategoriaChamado =
  | 'computador'
  | 'projetor'
  | 'internet'
  | 'eletrica'
  | 'mobiliario'
  | 'limpeza'
  | 'laboratorio'
  | 'outros';

export interface Chamado {
  id: string;
  protocolo: string;
  assunto: string;
  mensagem: string;
  solicitanteNome: string;
  solicitanteIniciais: string;
  local: string;
  categoria: CategoriaChamado;
  gravidade: GravidadeChamado;
  status: StatusChamado;
  /** ISO 8601 */
  abertoEm: string;
  destinatario: string;
  lido: boolean;
  anexoUrl?: string;
}
export interface Chamado {
  // ...campos que já existem...
  abertoEm: string;
  resolvidoEm?: string; // ISO 8601 — só quando status vira 'resolvido' ou 'fechado'
  destinatario: string;
  // ...resto igual...
}