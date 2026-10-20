import { useState, type CSSProperties, type ChangeEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  Send,
  Trash2,
  User,
  BarChart3,
  Settings,
  Users,
  Building2,
  Plus,
  MapPin,
  X
} from 'lucide-react';

import { mockLocais } from '../data/mockLocais.ts';

type SecaoConfiguracao = 'geral';

export function Configuracoes() {
  const navigate = useNavigate();
  const [secaoAtiva] = useState<SecaoConfiguracao>('geral');

  return (
    <div style={styles.appContainer}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarGroup}>
          <h2 style={styles.sidebarGroupTitle}>Chamados</h2>
          <nav style={styles.menuList}>
            <SidebarItem
              icon={<Inbox size={16} strokeWidth={2} />}
              label="Todos os chamados"
              onClick={() => navigate('/home')}
            />
            <SidebarItem
              icon={<Clock size={16} strokeWidth={2} />}
              label="Em andamento"
              onClick={() => navigate('/home')}
            />
            <SidebarItem
              icon={<Send size={16} strokeWidth={2} />}
              label="Enviados"
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
            <SidebarItem
              icon={<Settings size={16} strokeWidth={2} />}
              label="Configurações"
              active
            />
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
      </aside>

      <section style={styles.content}>
        <h1 style={styles.title}>Configurações</h1>

        <div style={styles.layout}>
          <nav style={styles.secMenu}>
            <button
              style={{
                ...styles.secMenuItem,
                ...(secaoAtiva === 'geral' ? styles.secMenuItemActive : {})
              }}
            >
              <Settings size={16} strokeWidth={2} color="#b81d24" />
              Geral
            </button>
          </nav>

          <div style={styles.panel}>{secaoAtiva === 'geral' && <SecaoGeral />}</div>
        </div>
      </section>
    </div>
  );
}

function SecaoGeral() {
  const [nomeInstituicao, setNomeInstituicao] = useState('ETEC de Taboão da Serra');
  const [fusoHorario, setFusoHorario] = useState('(GMT-03:00) Brasília');
  const [formatoData, setFormatoData] = useState('DD/MM/AAAA');
  const [idioma, setIdioma] = useState('Português (Brasil)');

  const [locais, setLocais] = useState<string[]>(mockLocais);
  const [novoLocal, setNovoLocal] = useState('');

  function adicionarLocal() {
    const nome = novoLocal.trim();
    if (!nome || locais.includes(nome)) return;
    setLocais((atual) => [...atual, nome]);
    setNovoLocal('');
  }

  function removerLocal(nome: string) {
    setLocais((atual) => atual.filter((local) => local !== nome));
  }

  function handleNovoLocalKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarLocal();
    }
  }

  return (
    <div style={styles.secaoWrapper}>
      <div style={styles.grupo}>
        <span style={styles.grupoTitulo}>INSTITUIÇÃO</span>

        <div style={styles.subcard}>
          <div style={styles.linha}>
            <div style={styles.logoCirculo}>
              <Building2 size={22} strokeWidth={1.8} color="#8e8e93" />
            </div>
            <div style={styles.linhaInfo}>
              <span style={styles.linhaLabel}>Logo da escola</span>
              <span style={styles.linhaValorFraco}>PNG ou SVG, fundo transparente</span>
            </div>
            <button style={styles.botaoSecundario}>Alterar</button>
          </div>

          <div style={styles.divisor} />

          <div style={styles.linhaCampo}>
            <label style={styles.linhaLabel}>Nome da instituição</label>
            <input
              style={styles.input}
              value={nomeInstituicao}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNomeInstituicao(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={styles.grupo}>
        <span style={styles.grupoTitulo}>REGIÃO E IDIOMA</span>

        <div style={styles.subcard}>
          <div style={styles.linhaCampo}>
            <label style={styles.linhaLabel}>Fuso horário</label>
            <select
              style={styles.select}
              value={fusoHorario}
              onChange={(e) => setFusoHorario(e.target.value)}
            >
              <option>(GMT-03:00) Brasília</option>
              <option>(GMT-04:00) Manaus</option>
              <option>(GMT-05:00) Rio Branco</option>
            </select>
          </div>

          <div style={styles.divisor} />

          <div style={styles.linhaCampo}>
            <label style={styles.linhaLabel}>Formato de data</label>
            <select
              style={styles.select}
              value={formatoData}
              onChange={(e) => setFormatoData(e.target.value)}
            >
              <option>DD/MM/AAAA</option>
              <option>MM/DD/AAAA</option>
            </select>
          </div>

          <div style={styles.divisor} />

          <div style={styles.linhaCampo}>
            <label style={styles.linhaLabel}>Idioma do sistema</label>
            <select style={styles.select} value={idioma} onChange={(e) => setIdioma(e.target.value)}>
              <option>Português (Brasil)</option>
              <option>English (US)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.grupo}>
        <span style={styles.grupoTitulo}>LOCAIS E SALAS</span>
        <p style={styles.grupoDescricao}>
          Esses são os locais que aparecem para escolha ao abrir um chamado.
        </p>

        <div style={styles.subcard}>
          {locais.map((local) => (
            <div key={local} style={styles.localLinha}>
              <span style={styles.localNome}>
                <MapPin size={14} strokeWidth={2} color="#b81d24" />
                {local}
              </span>
              <button
                style={styles.localRemover}
                onClick={() => removerLocal(local)}
                aria-label={`Remover ${local}`}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ))}

          <div style={styles.localAdicionarLinha}>
            <input
              style={styles.inputInline}
              placeholder="Ex.: Lab. 04, Quadra, Biblioteca…"
              value={novoLocal}
              onChange={(e) => setNovoLocal(e.target.value)}
              onKeyDown={handleNovoLocalKeyDown}
            />
            <button style={styles.botaoAdicionar} onClick={adicionarLocal}>
              <Plus size={14} strokeWidth={2} />
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <div style={styles.rodape}>
        <button style={styles.botaoSalvar}>Salvar alterações</button>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
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
    </button>
  );
}

const styles: Record<string, CSSProperties> = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f0f0f3',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden'
  },
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
  content: {
    flex: 1,
    padding: '28px 32px',
    overflowY: 'auto'
  },
  title: { fontSize: '26px', fontWeight: 600, color: '#000000', margin: '0 0 20px 0' },
  layout: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  secMenu: {
    width: '180px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  secMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#1d1d1f',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left'
  },
  secMenuItemActive: {
    backgroundColor: 'rgba(184, 29, 36, 0.08)'
  },
  panel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    minHeight: '560px',
    padding: '28px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
  },
  secaoWrapper: { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' },
  grupo: { display: 'flex', flexDirection: 'column', gap: '8px' },
  grupoTitulo: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8e8e93',
    letterSpacing: '0.04em'
  },
  grupoDescricao: { fontSize: '12px', color: '#8e8e93', margin: 0 },
  subcard: {
    border: '1px solid #ececec',
    borderRadius: '14px',
    overflow: 'hidden',
    backgroundColor: '#fcfcfd'
  },
  divisor: { height: '1px', backgroundColor: '#ececec' },
  linha: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px'
  },
  linhaInfo: { display: 'flex', flexDirection: 'column', flex: 1 },
  linhaLabel: { fontSize: '13px', color: '#1d1d1f', fontWeight: 500 },
  linhaValorFraco: { fontSize: '11px', color: '#8e8e93' },
  logoCirculo: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  linhaCampo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '12px 16px'
  },
  input: {
    flex: 1,
    maxWidth: '280px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d8d8dc',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
    textAlign: 'right',
    color: '#1d1d1f'
  },
  select: {
    flex: 1,
    maxWidth: '280px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d8d8dc',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1d1d1f',
    backgroundColor: '#ffffff'
  },
  botaoSecundario: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e8e8ed',
    color: '#1d1d1f',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    flexShrink: 0
  },
  localLinha: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid #ececec'
  },
  localNome: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#1d1d1f'
  },
  localRemover: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#8e8e93',
    padding: '4px',
    display: 'flex'
  },
  localAdicionarLinha: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px'
  },
  inputInline: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d8d8dc',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit'
  },
  botaoAdicionar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#b81d24',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  rodape: { display: 'flex', justifyContent: 'flex-end' },
  botaoSalvar: {
    padding: '10px 22px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#b81d24',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer'
  }
};