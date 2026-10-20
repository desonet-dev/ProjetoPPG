import { useMemo, type CSSProperties } from 'react';
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
  ChevronDown,
  MapPin
} from 'lucide-react';

import { mockChamados } from '../data/mockChamados.ts';
import type { Chamado } from '../types/chamado.ts';

export function Relatorios() {
  const navigate = useNavigate();
  const chamados = mockChamados;

  const metricas = useMemo(() => calcularMetricas(chamados), [chamados]);
  const locais = useMemo(() => calcularLocais(chamados), [chamados]);
  const porDia = useMemo(() => calcularChamadosPorDia(chamados), [chamados]);

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
              onClick={() => navigate('/home')}
            />
            <SidebarItem
              icon={<Clock size={16} strokeWidth={2} />}
              label="Em andamento"
              count={chamados.filter((c) => c.status === 'em_andamento').length}
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
            <SidebarItem icon={<BarChart3 size={16} strokeWidth={2} />} label="Relatórios" active />
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
      </aside>

      <section style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Relatórios</h1>
          <button style={styles.periodButton} title="Filtro de período (ainda não conectado)">
            Últimos 30 dias
            <ChevronDown size={14} strokeWidth={2} />
          </button>
        </div>

        <div style={styles.metricsRow}>
          <MetricCard
            titulo="Chamados abertos"
            valor={String(metricas.abertos)}
            cor="#ff3b30"
            pontos={[4, 7, 5, 9, 6, 10, metricas.abertos]}
          />
          <MetricCard
            titulo="Chamados em andamento"
            valor={String(metricas.emAndamento)}
            cor="#0a84ff"
            pontos={[2, 3, 2, 4, 3, 5, metricas.emAndamento]}
          />
          <MetricCard
            titulo="Chamados concluídos"
            valor={String(metricas.concluidos)}
            cor="#34c759"
            pontos={[0, 1, 1, 2, 1, 2, metricas.concluidos]}
          />
          <MetricCard
            titulo="Tempo médio de resolução"
            valor={metricas.tempoMedioHoras !== null ? formatarHoras(metricas.tempoMedioHoras) : '—'}
            sufixo={metricas.tempoMedioHoras !== null ? 'horas' : undefined}
            cor="#bf5af2"
            pontos={[8, 6, 7, 5, 6, 4, metricas.tempoMedioHoras ?? 0]}
          />
        </div>

        <div style={styles.bottomRow}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Locais com mais chamados</h2>
              <button style={styles.linkButton}>Ver todas</button>
            </div>

            <div style={styles.locaisTableHeader}>
              <span>Locais</span>
              <span>Chamados</span>
            </div>

            {locais.length === 0 && <p style={styles.emptyText}>Nenhum chamado registrado.</p>}

            {locais.slice(0, 5).map((item) => (
              <div key={item.local} style={styles.locaisRow}>
                <span style={styles.locaisNome}>
                  <MapPin size={13} strokeWidth={2} color="#b81d24" />
                  {item.local}
                </span>
                <span style={styles.locaisQuantidade}>{item.quantidade}</span>
                <span style={styles.locaisPercentual}>
                  {item.percentualDoTotal.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Chamados por dia</h2>
            </div>

            <BarChart dados={porDia} />
          </div>
        </div>
      </section>
    </div>
  );
}

interface Metricas {
  abertos: number;
  emAndamento: number;
  concluidos: number;
  tempoMedioHoras: number | null;
}

function calcularMetricas(chamados: Chamado[]): Metricas {
  const abertos = chamados.filter((c) => c.status === 'aberto').length;
  const emAndamento = chamados.filter((c) => c.status === 'em_andamento').length;
  const resolvidos = chamados.filter((c) => c.status === 'resolvido' || c.status === 'fechado');

  const comTempoDeResolucao = resolvidos.filter((c) => c.resolvidoEm);
  const tempoMedioHoras =
    comTempoDeResolucao.length === 0
      ? null
      : comTempoDeResolucao.reduce((soma, c) => {
          const horas =
            (new Date(c.resolvidoEm as string).getTime() - new Date(c.abertoEm).getTime()) /
            (1000 * 60 * 60);
          return soma + horas;
        }, 0) / comTempoDeResolucao.length;

  return { abertos, emAndamento, concluidos: resolvidos.length, tempoMedioHoras };
}

interface LocalComContagem {
  local: string;
  quantidade: number;
  percentualDoTotal: number;
}

function calcularLocais(chamados: Chamado[]): LocalComContagem[] {
  const contagem = new Map<string, number>();

  for (const chamado of chamados) {
    contagem.set(chamado.local, (contagem.get(chamado.local) ?? 0) + 1);
  }

  const total = chamados.length || 1;

  return Array.from(contagem.entries())
    .map(([local, quantidade]) => ({
      local,
      quantidade,
      percentualDoTotal: (quantidade / total) * 100
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

interface DiaComContagem {
  rotulo: string;
  quantidade: number;
}

function calcularChamadosPorDia(chamados: Chamado[]): DiaComContagem[] {
  const DIAS = 7;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const resultado: DiaComContagem[] = [];

  for (let i = DIAS - 1; i >= 0; i--) {
    const dia = new Date(hoje);
    dia.setDate(hoje.getDate() - i);

    const quantidade = chamados.filter((chamado) => {
      const abertura = new Date(chamado.abertoEm);
      return (
        abertura.getFullYear() === dia.getFullYear() &&
        abertura.getMonth() === dia.getMonth() &&
        abertura.getDate() === dia.getDate()
      );
    }).length;

    resultado.push({
      rotulo: dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      quantidade
    });
  }

  return resultado;
}

function formatarHoras(horas: number): string {
  return horas.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
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

interface MetricCardProps {
  titulo: string;
  valor: string;
  sufixo?: string;
  cor: string;
  pontos: number[];
}

function MetricCard({ titulo, valor, sufixo, cor, pontos }: MetricCardProps) {
  return (
    <div style={styles.metricCard}>
      <span style={styles.metricTitulo}>{titulo}</span>
      <div style={styles.metricValorRow}>
        <span style={styles.metricValor}>{valor}</span>
        {sufixo && <span style={styles.metricSufixo}>{sufixo}</span>}
      </div>
      <Sparkline pontos={pontos} cor={cor} />
    </div>
  );
}

function Sparkline({ pontos, cor }: { pontos: number[]; cor: string }) {
  const largura = 240;
  const altura = 48;
  const max = Math.max(...pontos, 1);
  const min = Math.min(...pontos, 0);
  const amplitude = max - min || 1;

  const coordenadas = pontos
    .map((valor, index) => {
      const x = (index / (pontos.length - 1)) * largura;
      const y = altura - ((valor - min) / amplitude) * altura;
      return `${x},${y}`;
    })
    .join(' ');

  const gradId = `grad-${cor.replace('#', '')}`;

  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      width="100%"
      height={altura}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={cor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline points={coordenadas} fill="none" stroke={cor} strokeWidth={2} />
      <polygon points={`0,${altura} ${coordenadas} ${largura},${altura}`} fill={`url(#${gradId})`} />
    </svg>
  );
}

function BarChart({ dados }: { dados: DiaComContagem[] }) {
  const max = Math.max(...dados.map((d) => d.quantidade), 1);

  return (
    <div style={styles.barChart}>
      {dados.map((dia) => (
        <div key={dia.rotulo} style={styles.barColuna}>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                height: `${(dia.quantidade / max) * 100}%`
              }}
              title={`${dia.quantidade} chamado(s)`}
            />
          </div>
          <span style={styles.barRotulo}>{dia.rotulo}</span>
        </div>
      ))}
    </div>
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
  badge: { fontSize: '11px', color: '#8e8e93' },
  content: {
    flex: 1,
    padding: '28px 32px',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  title: { fontSize: '26px', fontWeight: 600, color: '#000000' },
  periodButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#b81d24',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer'
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '16px'
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
  },
  metricTitulo: { fontSize: '13px', color: '#6e6e73' },
  metricValorRow: { display: 'flex', alignItems: 'baseline', gap: '6px' },
  metricValor: { fontSize: '30px', fontWeight: 600, color: '#000000' },
  metricSufixo: { fontSize: '13px', color: '#8e8e93' },
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: '16px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  cardTitle: { fontSize: '14px', fontWeight: 600, color: '#000000' },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#0a84ff',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer'
  },
  locaisTableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#8e8e93',
    padding: '0 0 8px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  emptyText: { fontSize: '12px', color: '#8e8e93', padding: '12px 0' },
  locaisRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f5f5f7',
    fontSize: '13px'
  },
  locaisNome: { display: 'flex', alignItems: 'center', gap: '6px', color: '#1d1d1f', flex: 1 },
  locaisQuantidade: { color: '#1d1d1f', width: '40px', textAlign: 'right' },
  locaisPercentual: { color: '#34c759', width: '48px', textAlign: 'right', fontSize: '12px' },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '180px',
    gap: '10px',
    paddingTop: '12px'
  },
  barColuna: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    height: '100%'
  },
  barTrack: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f7',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    backgroundColor: '#b81d24',
    borderRadius: '6px 6px 0 0',
    transition: 'height 0.3s ease'
  },
  barRotulo: { fontSize: '11px', color: '#8e8e93', textTransform: 'capitalize' }
};