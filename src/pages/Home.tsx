import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {
  Inbox,
  Clock,
  Send,
  Trash2,
  User,
  BarChart3,
  Settings,
  Users,
  CircleCheck,
  Forward,
  Archive,
  LogOut,
  FileText
} from 'lucide-react';

import { auth } from '../services/firebaseConfig.ts';
import { mockChamados } from '../data/mockChamados.ts';
import type { Chamado, StatusChamado } from '../types/chamado.ts';
import { formatarDataRelativa, formatarDataCompleta } from '../utils/data.ts';

type FiltroChamados = 'todos' | Extract<StatusChamado, 'em_andamento'> | 'enviados' | 'lixeira';

export function Home() {
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState<FiltroChamados>('todos');
  const [chamados] = useState<Chamado[]>(mockChamados);
  const [chamadoSelecionadoId, setChamadoSelecionadoId] = useState<string | null>(
    mockChamados[0]?.id ?? null
  );

  const chamadosFiltrados = useMemo(() => {
    if (filtro === 'em_andamento') {
      return chamados.filter((chamado) => chamado.status === 'em_andamento');
    }
    // "Enviados" e "Lixeira" ainda não têm dado real — ficam vazios até o
    // back-end existir, em vez de mostrar números que não significam nada.
    if (filtro === 'enviados' || filtro === 'lixeira') {
      return [];
    }
    return chamados;
  }, [chamados, filtro]);

  const chamadoSelecionado =
    chamados.find((chamado) => chamado.id === chamadoSelecionadoId) ?? null;

  const totalEmAndamento = chamados.filter((c) => c.status === 'em_andamento').length;
  const naoRespondidos = chamados.filter((c) => !c.lido).length;

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
    }
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
              count={chamados.length}
              active={filtro === 'todos'}
              onClick={() => setFiltro('todos')}
            />
            <SidebarItem
              icon={<Clock size={16} strokeWidth={2} />}
              label="Em andamento"
              count={totalEmAndamento}
              active={filtro === 'em_andamento'}
              onClick={() => setFiltro('em_andamento')}
            />
            <SidebarItem
              icon={<Send size={16} strokeWidth={2} />}
              label="Enviados"
              count={0}
              active={filtro === 'enviados'}
              onClick={() => setFiltro('enviados')}
            />
            <SidebarItem
              icon={<Trash2 size={16} strokeWidth={2} />}
              label="Lixeira"
              active={filtro === 'lixeira'}
              onClick={() => setFiltro('lixeira')}
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
            <SidebarItem icon={<Settings size={16} strokeWidth={2} />} label="Configurações" onClick={() => navigate('/configuracoes')} />
          </nav>
        </div>

        <div style={styles.sidebarGroup}>
          <h2 style={styles.sidebarGroupTitle}>Sistema</h2>

          <nav style={styles.menuList}>
            <SidebarItem
              icon={<Users size={16} strokeWidth={2} />}
              label="Usuários"
              onClick={() => navigate('/usuarios')}
            />
          </nav>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={16} strokeWidth={2} />
          <span>Sair da conta</span>
        </button>
      </aside>

      <section style={styles.listColumn}>
        <div style={styles.listHeader}>
          <h2 style={styles.listTitle}>
            {filtro === 'todos' && 'Todos os chamados'}
            {filtro === 'em_andamento' && 'Em andamento'}
            {filtro === 'enviados' && 'Enviados'}
            {filtro === 'lixeira' && 'Lixeira'}
          </h2>
          <span style={styles.listSubtitle}>
            {chamadosFiltrados.length} chamados, {naoRespondidos} não lidos
          </span>
        </div>

        <div style={styles.listItems}>
          {chamadosFiltrados.length === 0 && (
            <div style={styles.emptyListState}>
              <span style={styles.emptyListText}>Nenhum chamado aqui.</span>
            </div>
          )}

          {chamadosFiltrados.map((chamado) => {
            const selecionado = chamado.id === chamadoSelecionadoId;

            return (
              <button
                key={chamado.id}
                onClick={() => setChamadoSelecionadoId(chamado.id)}
                style={{
                  ...styles.listItem,
                  ...(selecionado ? styles.listItemSelected : {})
                }}
              >
                <div style={styles.listItemTopRow}>
                  <span
                    style={{
                      ...styles.listItemAssunto,
                      ...(chamado.lido ? {} : styles.listItemAssuntoNaoLido)
                    }}
                  >
                    {chamado.assunto}
                  </span>
                  <span style={styles.listItemData}>
                    {formatarDataRelativa(chamado.abertoEm)}
                  </span>
                </div>

                <div style={styles.listItemRemetente}>
                  {chamado.solicitanteNome} · {chamado.local}
                </div>

                <div style={styles.listItemPreview}>{chamado.mensagem}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section style={styles.detailColumn}>
        {chamadoSelecionado ? (
          <div style={styles.detailWrapper}>
            <div style={styles.detailToolbar}>
              <ToolbarButton title="Marcar como resolvido">
                <CircleCheck size={18} strokeWidth={2} color="#b81d24" />
              </ToolbarButton>
              <ToolbarButton title="Responder">
                <Send size={18} strokeWidth={2} color="#b81d24" />
              </ToolbarButton>
              <ToolbarButton title="Encaminhar">
                <Forward size={18} strokeWidth={2} color="#b81d24" />
              </ToolbarButton>
              <ToolbarButton title="Arquivar">
                <Archive size={18} strokeWidth={2} color="#b81d24" />
              </ToolbarButton>
              <ToolbarButton title="Excluir">
                <Trash2 size={18} strokeWidth={2} color="#b81d24" />
              </ToolbarButton>
            </div>

            <div style={styles.detailMeta}>
              <div style={styles.detailAvatar}>{chamadoSelecionado.solicitanteIniciais}</div>

              <div style={styles.detailMetaInfo}>
                <span style={styles.detailMetaLabel}>De:</span>
                <span style={styles.detailMetaNome}>{chamadoSelecionado.solicitanteNome}</span>
              </div>

              <div style={styles.detailMetaRight}>
                <span style={styles.detailMetaData}>
                  {formatarDataCompleta(chamadoSelecionado.abertoEm)}
                </span>
                <span style={styles.detailMetaPara}>Para: {chamadoSelecionado.destinatario}</span>
              </div>
            </div>

            <h1 style={styles.detailAssunto}>{chamadoSelecionado.assunto}</h1>

            <div style={styles.detailCorpo}>
              {chamadoSelecionado.mensagem.split('\n\n').map((paragrafo: string, index: number) => (
                <p key={index} style={styles.detailParagrafo}>
                  {paragrafo}
                </p>
              ))}
            </div>

            {/* Espaço reservado para a foto/anexo enviado junto do chamado.
                Troque por <img src={chamadoSelecionado.anexoUrl} /> quando o upload
                de imagem estiver integrado. */}
            <div style={styles.detailAnexo} aria-label="Anexo do chamado">
              {!chamadoSelecionado.anexoUrl && (
                <span style={styles.detailAnexoPlaceholder}>Sem anexo</span>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.detailPlaceholder}>
            <FileText size={48} color="#cccccc" strokeWidth={1.5} />
            <p style={styles.detailPlaceholderText}>
              Selecione um chamado para visualizar os detalhes
            </p>
          </div>
        )}
      </section>
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

interface ToolbarButtonProps {
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ title, children }: ToolbarButtonProps) {
  return (
    <button style={styles.toolbarButton} title={title}>
      {children}
    </button>
  );
}

const styles: Record<string, CSSProperties> = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#ffffff',
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    overflow: 'hidden'
  },

  // Sidebar
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
  sidebarGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  sidebarGroupTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#000000',
    margin: '0 0 10px 8px',
    textAlign: 'left'
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
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
  menuItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  menuItemIcon: {
    display: 'flex',
    alignItems: 'center',
    color: 'inherit'
  },
  badge: {
    fontSize: '11px',
    color: '#8e8e93'
  },
  logoutButton: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#b81d24',
    fontSize: '13px',
    fontWeight: 400,
    cursor: 'pointer'
  },

  // Coluna da lista
  listColumn: {
    width: '320px',
    flexShrink: 0,
    borderRight: '1px solid #eaeaea',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  listHeader: {
    padding: '20px 20px 12px 20px'
  },
  listTitle: {
    fontSize: '22px',
    fontWeight: 600,
    margin: '0 0 4px 0',
    color: '#000000',
    textAlign: 'left'
  },
  listSubtitle: {
    fontSize: '12px',
    color: '#8e8e93'
  },
  listItems: {
    flex: 1,
    overflowY: 'auto',
    borderTop: '1px solid #f0f0f0'
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
    padding: '12px 20px',
    border: 'none',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer'
  },
  listItemSelected: {
    backgroundColor: '#f2f2f2'
  },
  listItemTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  listItemAssunto: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#1d1d1f'
  },
  listItemAssuntoNaoLido: {
    color: '#b81d24'
  },
  listItemData: {
    fontSize: '11px',
    color: '#8e8e93',
    flexShrink: 0,
    marginLeft: '8px'
  },
  listItemRemetente: {
    fontSize: '12px',
    color: '#3c3c43'
  },
  listItemPreview: {
    fontSize: '12px',
    color: '#8e8e93',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  emptyListState: {
    padding: '40px 20px',
    textAlign: 'center'
  },
  emptyListText: {
    fontSize: '13px',
    color: '#8e8e93'
  },

  // Coluna de detalhe
  detailColumn: {
    flex: 1,
    backgroundColor: '#ffffff',
    overflowY: 'auto'
  },
  detailWrapper: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: '20px 32px 40px 32px'
  },
  detailToolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '4px',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '12px',
    marginBottom: '20px'
  },
  toolbarButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailMeta: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px'
  },
  detailAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e5e5ea',
    color: '#636366',
    fontSize: '13px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  detailMetaInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  detailMetaLabel: {
    fontSize: '11px',
    color: '#8e8e93'
  },
  detailMetaNome: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1d1d1f'
  },
  detailMetaRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  detailMetaData: {
    fontSize: '12px',
    color: '#8e8e93'
  },
  detailMetaPara: {
    fontSize: '12px',
    color: '#8e8e93'
  },
  detailAssunto: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#1d1d1f',
    margin: '0 0 16px 0'
  },
  detailCorpo: {
    marginBottom: '20px'
  },
  detailParagrafo: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#1d1d1f',
    margin: '0 0 14px 0'
  },
  detailAnexo: {
    width: '100%',
    minHeight: '320px',
    backgroundColor: '#d9d9d9',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailAnexoPlaceholder: {
    fontSize: '12px',
    color: '#8e8e93'
  },
  detailPlaceholder: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  },
  detailPlaceholderText: {
    fontSize: '14px',
    color: '#999999'
  }
};
