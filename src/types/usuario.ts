export type CargoUsuario = 'secretaria' | 'aluno' | 'professor';

export type StatusUsuario = 'ativo' | 'inativo' | 'convite_pendente';

export const STATUS_LABEL: Record<StatusUsuario, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  convite_pendente: 'Convite pendente'
};

export const STATUS_COR: Record<StatusUsuario, string> = {
  ativo: '#34c759',
  inativo: '#8e8e93',
  convite_pendente: '#ff9f0a'
};

export interface Usuario {
  /** Mesmo id do documento no Firestore (coleção "usuarios"). Quando o
   *  usuário já fez login pelo menos uma vez, este id é igual ao uid
   *  dele no Firebase Authentication. */
  id: string;
  nome: string;
  email: string;
  cargo: CargoUsuario;
  status: StatusUsuario;
  /** ISO 8601, preenchido pelo servidor no momento da criação. */
  criadoEm: string | null;
}

export const CARGO_LABEL: Record<CargoUsuario, string> = {
  secretaria: 'Secretaria',
  aluno: 'Aluno',
  professor: 'Professor'
};
