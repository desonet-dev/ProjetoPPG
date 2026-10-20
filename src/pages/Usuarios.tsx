import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore';
import {
  Inbox,
  Clock,
  Send,
  Trash2,
  User,
  BarChart3,
  Settings,
  Users,
  UserPlus,
  MoreHorizontal,
  X
} from 'lucide-react';

import { db } from '../services/firebaseConfig.ts';
import {
  CARGO_LABEL,
  STATUS_LABEL,
  STATUS_COR,
  type Usuario,
  type CargoUsuario
} from '../types/usuario.ts';
import { obterIniciais } from '../utils/data.ts';

interface UsuarioDoc {
  nome: string;
  email: string;
  cargo: CargoUsuario;
  status: Usuario['status'];
  criadoEm: Timestamp | null;
}

export function Usuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [modalAberto, setModalAberto] = useState<'adicionar' | 'editar' | 'excluir' | null>(
    null
  );
  const [usuarioEmFoco, setUsuarioEmFoco] = useState<Usuario | null>(null);
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'usuarios'),
      (snapshot) => {
        const lista: Usuario[] = snapshot.docs.map((docSnap) => {
          const dados = docSnap.data() as UsuarioDoc;
          return {
            id: docSnap.id,
            nome: dados.nome,
            email: dados.email,
            cargo: dados.cargo,
            status: dados.status,
            criadoEm: dados.criadoEm ? dados.criadoEm.toDate().toISOString() : null
          };
        });

        lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        setUsuarios(lista);
        setCarregando(false);
      },
      (error) => {
        console.error('Erro ao ler usuários do Firestore:', error);
        setErro(
          'Não foi possível carregar os usuários. Verifique as regras de segurança do Firestore.'
        );
        setCarregando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function handleExcluir(usuario: Usuario) {
    await deleteDoc(doc(db, 'usuarios', usuario.id));
    setModalAberto(null);
    setUsuarioEmFoco(null);
  }

  async function handleAlternarStatus(usuario: Usuario) {
    setMenuAbertoId(null);
    await updateDoc(doc(db, 'usuarios', usuario.id), {
      status: usuario.status === 'ativo' ? 'inativo' : 'ativo'
    });
  }

  return (
    <div style={styles.appContainer}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarGroup}>
          <h2 style={styles.sidebarGroupTitle}>Chamados</h2>
          <nav style={styles.menuList}>
            <SidebarItem
              icon={<Inbox size={16} strokeWidth={2} />}
              label="Todos os chamados"
              count={0}
              onClick={() => navigate('/home')}
            />
            <SidebarItem
              icon={<Clock size={16} strokeWidth={2} />}
              label="Em andamento"
              count={0}
              onClick={() => navigate('/home')}
            />
            <SidebarItem
              icon={<Send size={16} strokeWidth={2} />}
              label="Enviados"
              count={0}
              onClick={() => navigate('/home')}
            />
            <SidebarItem
              icon={<Trash2 size={16} strokeWidth={2} />}
              label="Lixeira"
              onClick={() => navigate('/home')}
            />
          </nav>
        </div>

        <div style={styles.sidebarGroup}>
          <h2 style={styles.sidebarGroupTitle}>Para você</h2>
          <nav style={styles.menuList}>
            <SidebarItem icon={<User size={16} strokeWidth={2} />} label="Perfil" />
            <SidebarItem 
            icon={<BarChart3 size={16} strokeWidth={2} />} 
            label="Relatórios" 
            onClick={() => navigate('/relatorios')}
            />
            <SidebarItem icon={<Settings size={16} strokeWidth={2} />} label="Configurações" onClick={() => navigate('/Configuracoes')} />
          </nav>
        </div>

        <div style={styles.sidebarGroup}>
          <h2 style={styles.sidebarGroupTitle}>Sistema</h2>
          <nav style={styles.menuList}>
            <SidebarItem icon={<Users size={16} strokeWidth={2} />} label="Usuários" active />
          </nav>
        </div>
      </aside>

      <section style={styles.content}>
        <div style={styles.contentHeader}>
          <h1 style={styles.contentTitle}>Usuários</h1>
        </div>

        <div style={styles.toolbar}>
          <button
            style={styles.addButton}
            onClick={() => {
              setUsuarioEmFoco(null);
              setModalAberto('adicionar');
            }}
          >
            <UserPlus size={16} strokeWidth={2} />
            Adicionar Usuários
          </button>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeaderRow}>
            <span style={{ ...styles.tableHeaderCell, flex: 2.4 }}>Nome</span>
            <span style={{ ...styles.tableHeaderCell, flex: 1.4 }}>Cargo</span>
            <span style={{ ...styles.tableHeaderCell, flex: 1.2 }}>Status</span>
            <span style={{ ...styles.tableHeaderCell, flex: 0.6, textAlign: 'right' }}>
              Ações
            </span>
          </div>

          {carregando && <div style={styles.tableState}>Carregando usuários…</div>}

          {!carregando && erro && (
            <div style={{ ...styles.tableState, color: '#b81d24' }}>{erro}</div>
          )}

          {!carregando && !erro && usuarios.length === 0 && (
            <div style={styles.tableState}>
              Nenhum usuário cadastrado ainda. Clique em "Adicionar Usuários" para começar.
            </div>
          )}

          {!carregando &&
            !erro &&
            usuarios.map((usuario) => (
              <div key={usuario.id} style={styles.tableRow}>
                <div style={{ ...styles.tableCell, flex: 2.4 }}>
                  <div style={styles.avatar}>{obterIniciais(usuario.nome)}</div>
                  <div style={styles.userInfo}>
                    <span style={styles.userName}>{usuario.nome}</span>
                    <span style={styles.userEmail}>{usuario.email}</span>
                  </div>
                </div>

                <div style={{ ...styles.tableCell, flex: 1.4 }}>
                  <span style={styles.cargoBadge}>{CARGO_LABEL[usuario.cargo]}</span>
                </div>

                <div style={{ ...styles.tableCell, flex: 1.2 }}>
                  <span
                    style={{
                      ...styles.statusDot,
                      backgroundColor: STATUS_COR[usuario.status]
                    }}
                  />
                  <span style={styles.statusLabel}>{STATUS_LABEL[usuario.status]}</span>
                </div>

                <div style={{ ...styles.tableCell, flex: 0.6, justifyContent: 'flex-end' }}>
                  <div style={{ position: 'relative' }}>
                    <button
                      style={styles.menuButton}
                      onClick={() =>
                        setMenuAbertoId(menuAbertoId === usuario.id ? null : usuario.id)
                      }
                    >
                      <MoreHorizontal size={18} strokeWidth={2} />
                    </button>

                    {menuAbertoId === usuario.id && (
                      <div style={styles.dropdown}>
                        <button
                          style={styles.dropdownItem}
                          onClick={() => {
                            setUsuarioEmFoco(usuario);
                            setModalAberto('editar');
                            setMenuAbertoId(null);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          style={styles.dropdownItem}
                          onClick={() => {
                            setUsuarioEmFoco(usuario);
                            setModalAberto('excluir');
                            setMenuAbertoId(null);
                          }}
                        >
                          Excluir
                        </button>
                        <button
                          style={styles.dropdownItem}
                          onClick={() => handleAlternarStatus(usuario)}
                        >
                          {usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {(modalAberto === 'adicionar' || modalAberto === 'editar') && (
        <UsuarioFormModal
          usuario={usuarioEmFoco}
          onFechar={() => setModalAberto(null)}
        />
      )}

      {modalAberto === 'excluir' && usuarioEmFoco && (
        <ExcluirUsuarioModal
          usuario={usuarioEmFoco}
          onCancelar={() => setModalAberto(null)}
          onConfirmar={() => handleExcluir(usuarioEmFoco)}
        />
      )}
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, count, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.menuItem,
        ...(active ? styles.menuItemActive : {})
      }}
    >
      <span style={styles.menuItemLeft}>
        <span style={styles.menuItemIcon}>{icon}</span>
        {label}
      </span>
      {typeof count === 'number' && <span style={styles.badge}>{count}</span>}
    </button>
  );
}

interface UsuarioFormModalProps {
  /** null = modo "adicionar"; preenchido = modo "editar" */
  usuario: Usuario | null;
  onFechar: () => void;
}

function UsuarioFormModal({ usuario, onFechar }: UsuarioFormModalProps) {
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [cargo, setCargo] = useState<CargoUsuario>(usuario?.cargo ?? 'professor');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const editando = usuario !== null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !email.trim()) {
      setErro('Preencha nome e e-mail.');
      return;
    }

    try {
      setSalvando(true);

      if (editando) {
        await updateDoc(doc(db, 'usuarios', usuario.id), { nome, email, cargo });
      } else {
        // Importante: isto cria só o PERFIL (Firestore), não a conta de
        // login (Firebase Authentication). Criar login de outra pessoa
        // pelo SDK do cliente trocaria a sessão da secretaria pela da
        // pessoa nova — por segurança o Firebase não permite isso sem um
        // back-end (Admin SDK/Cloud Function). Por ora, a pessoa recebe
        // o convite e cria a própria senha pela tela de Cadastro; quando
        // ela logar pela primeira vez, o sistema já teria que ligar essa
        // conta a este registro (ainda não implementado — ver TODO no
        // protectedRoute.tsx).
        await addDoc(collection(db, 'usuarios'), {
          nome,
          email,
          cargo,
          status: 'convite_pendente',
          criadoEm: serverTimestamp()
        });
      }

      onFechar();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setErro('Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <button style={styles.modalClose} onClick={onFechar} aria-label="Fechar">
          <X size={16} strokeWidth={2} />
        </button>

        <h2 style={styles.modalTitle}>{editando ? 'Editar usuário' : 'Adicionar usuario'}</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.modalRow}>
            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Nome completo</label>
              <input
                style={styles.modalInput}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoFocus
              />
            </div>

            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Email Institucional</label>
              <input
                style={styles.modalInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.modalField}>
            <label style={styles.modalLabel}>Cargo</label>
            <div style={styles.segmentedControl}>
              {(['secretaria', 'aluno', 'professor'] as const).map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => setCargo(opcao)}
                  style={{
                    ...styles.segmentedOption,
                    ...(cargo === opcao ? styles.segmentedOptionActive : {})
                  }}
                >
                  {CARGO_LABEL[opcao]}
                </button>
              ))}
            </div>
          </div>

          {erro && <p style={styles.modalError}>{erro}</p>}

          <div style={styles.modalActions}>
            <button type="button" style={styles.modalCancelBtn} onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" style={styles.modalSaveBtn} disabled={salvando}>
              {salvando ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ExcluirUsuarioModalProps {
  usuario: Usuario;
  onCancelar: () => void;
  onConfirmar: () => void;
}

function ExcluirUsuarioModal({ usuario, onCancelar, onConfirmar }: ExcluirUsuarioModalProps) {
  const [excluindo, setExcluindo] = useState(false);

  async function handleConfirmar() {
    setExcluindo(true);
    await onConfirmar();
    setExcluindo(false);
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalCard, maxWidth: '400px', textAlign: 'center' }}>
        <button style={styles.modalClose} onClick={onCancelar} aria-label="Fechar">
          <X size={16} strokeWidth={2} />
        </button>

        <h2 style={{ ...styles.modalTitle, textAlign: 'center' }}>Excluir usuário?</h2>

        <p style={styles.modalDescricao}>
          Esta ação excluirá permanentemente o usuário e dados de {usuario.nome}, confirme
          para a ação se concluir.
        </p>

        <div style={{ ...styles.modalActions, justifyContent: 'center' }}>
          <button style={styles.modalCancelBtn} onClick={onCancelar}>
            Cancelar
          </button>
          <button style={styles.modalDeleteBtn} onClick={handleConfirmar} disabled={excluindo}>
            {excluindo ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#ffffff',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden'
  },

  // Sidebar (igual à Home, pra ficar consistente)
  sidebar: {
    width: '220px',
    flexShrink: 0,
    borderRight: '1px solid #eaeaea',
    backgroundColor: '#fbfbfb',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sidebarGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  sidebarGroupTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#000000',
    margin: '0 0 10px 8px',
    textAlign: 'left'
  },
  menuList: { display: 'flex', flexDirection: 'column', gap: '2px' },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#3c3c43',
    fontSize: '13px',
    fontWeight: 400,
    cursor: 'pointer',
    textAlign: 'left'
  },
  menuItemActive: {
    backgroundColor: 'rgba(184, 29, 36, 0.1)',
    color: '#b81d24',
    fontWeight: 500
  },
  menuItemLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  menuItemIcon: { display: 'flex', alignItems: 'center', color: 'inherit' },
  badge: { fontSize: '11px', color: '#8e8e93' },

  // Conteúdo
  content: {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto'
  },
  contentHeader: { marginBottom: '24px' },
  contentTitle: { fontSize: '26px', fontWeight: 600, color: '#000000' },

  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#b81d24',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer'
  },

  // Tabela
  tableCard: {
    border: '1px solid #eaeaea',
    borderRadius: '14px',
    overflow: 'hidden'
  },
  tableHeaderRow: {
    display: 'flex',
    padding: '12px 20px',
    backgroundColor: '#f5f5f7',
    borderBottom: '1px solid #eaeaea'
  },
  tableHeaderCell: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8e8e93',
    textTransform: 'uppercase',
    letterSpacing: '0.03em'
  },
  tableState: {
    padding: '32px 20px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#8e8e93'
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #f0f0f0'
  },
  tableCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: '#e5e5ea',
    color: '#636366',
    fontSize: '12px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  userInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontSize: '13px', fontWeight: 500, color: '#1d1d1f' },
  userEmail: { fontSize: '12px', color: '#8e8e93' },
  cargoBadge: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#3c3c43',
    backgroundColor: '#f0f0f2',
    padding: '4px 12px',
    borderRadius: '999px'
  },
  statusDot: { width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0 },
  statusLabel: { fontSize: '13px', color: '#3c3c43' },

  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    color: '#8e8e93'
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '28px',
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    borderRadius: '10px',
    padding: '6px',
    width: '140px',
    zIndex: 50
  },
  dropdownItem: {
    width: '100%',
    padding: '8px 10px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '13px',
    color: '#1d1d1f',
    cursor: 'pointer',
    borderRadius: '6px'
  },

  // Modais
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  modalCard: {
    position: 'relative',
    width: '100%',
    maxWidth: '520px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#b81d24'
  },
  modalTitle: { fontSize: '20px', fontWeight: 600, color: '#000000', margin: '0 0 20px 0' },
  modalDescricao: { fontSize: '13px', color: '#6e6e73', lineHeight: 1.5, margin: '0 0 24px 0' },
  modalRow: { display: 'flex', gap: '16px', marginBottom: '4px' },
  modalField: { flex: 1, marginBottom: '16px' },
  modalLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#6e6e73',
    marginBottom: '6px'
  },
  modalInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #d0d0d0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  segmentedControl: {
    display: 'flex',
    backgroundColor: '#f0f0f2',
    borderRadius: '10px',
    padding: '3px',
    gap: '2px'
  },
  segmentedOption: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '12px',
    fontWeight: 500,
    color: '#3c3c43',
    cursor: 'pointer'
  },
  segmentedOptionActive: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    color: '#000000'
  },
  modalError: { fontSize: '12px', color: '#b81d24', margin: '0 0 12px 0' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' },
  modalCancelBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#e8e8ed',
    color: '#1d1d1f',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer'
  },
  modalSaveBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#b81d24',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer'
  },
  modalDeleteBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#b81d24',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer'
  }
};
