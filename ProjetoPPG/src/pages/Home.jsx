import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Bell, Settings, ChevronDown, Monitor, FileText, Send, Trash2, PlusCircle, Search, ListFilter, User, LogOut } from 'lucide-react';
import { auth } from '../services/firebaseConfig';

export function Home() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('todos');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Erro ao encerrar sessão:', error);
        }
    };

    return (
        <div style={styles.appContainer}>
            <header style={styles.header}>
                <div style={styles.brandTitle}>
                    Projeto PPG
                </div>

                <div style={styles.headerActions}>
                    <button
                        style={styles.iconButton}
                        title="Notificações"
                    >
                        <Bell
                            size={20}
                            color="#b81d24"
                            strokeWidth={2}
                        />
                    </button>

                    <button
                        style={styles.iconButton}
                        title="Configurações"
                    >
                        <Settings
                            size={20}
                            color="#b81d24"
                            strokeWidth={2}
                        />
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={styles.avatarButton}
                        >
                            <div style={styles.avatarCircle}>
                                <User
                                    size={18}
                                    color="#ffffff"
                                    strokeWidth={2}
                                />
                            </div>

                            <ChevronDown
                                size={12}
                                color="#666"
                                strokeWidth={2}
                            />
                        </button>

                        {showUserMenu && (
                            <div style={styles.userDropdown}>
                                <button
                                    onClick={handleLogout}
                                    style={styles.dropdownItem}
                                >
                                    <LogOut
                                        size={16}
                                        color="#b81d24"
                                        strokeWidth={2}
                                    />

                                    <span>Sair da conta</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div style={styles.mainContent}>
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <h2 style={styles.sidebarTitle}>
                            Chamados
                        </h2>
                    </div>

                    <nav style={styles.menuList}>
                        <button
                            onClick={() => setActiveCategory('todos')}
                            style={{
                                ...styles.menuItem,
                                ...(activeCategory === 'todos'
                                    ? styles.menuItemActive
                                    : {})
                            }}
                        >
                            <div style={styles.menuItemLeft}>
                                <Monitor
                                    size={16}
                                    strokeWidth={2}
                                    style={{ marginRight: '10px' }}
                                />
                                Todos os chamados
                            </div>

                            <span style={styles.badge}>
                                0
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveCategory('respondidos')}
                            style={{
                                ...styles.menuItem,
                                ...(activeCategory === 'respondidos'
                                    ? styles.menuItemActive
                                    : {})
                            }}
                        >
                            <div style={styles.menuItemLeft}>
                                <FileText
                                    size={16}
                                    strokeWidth={2}
                                    style={{ marginRight: '10px' }}
                                />
                                Respondidos
                            </div>

                            <span style={styles.badge}>
                                0
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveCategory('enviados')}
                            style={{
                                ...styles.menuItem,
                                ...(activeCategory === 'enviados'
                                    ? styles.menuItemActive
                                    : {})
                            }}
                        >
                            <div style={styles.menuItemLeft}>
                                <Send
                                    size={16}
                                    strokeWidth={2}
                                    style={{ marginRight: '10px' }}
                                />
                                Enviados
                            </div>

                            <span style={styles.badge}>
                                0
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveCategory('lixeira')}
                            style={{
                                ...styles.menuItem,
                                ...(activeCategory === 'lixeira'
                                    ? styles.menuItemActive
                                    : {})
                            }}
                        >
                            <div style={styles.menuItemLeft}>
                                <Trash2
                                    size={16}
                                    strokeWidth={2}
                                    style={{ marginRight: '10px' }}
                                />

                                Lixeira
                            </div>

                            <span style={styles.badge}>
                                0
                            </span>
                        </button>

                    </nav>
                </aside>

                <section style={styles.ticketsColumn}>
                    <div style={styles.ticketsHeader}>
                        <div>
                            <h2 style={styles.ticketsTitle}>
                                Seus chamados
                            </h2>

                            <span style={styles.ticketsSubtitle}>
                                0 chamados
                            </span>
                        </div>

                        <div style={styles.ticketsActions}>
                            <button
                                style={styles.actionIconButton}
                                title="Novo chamado"
                            >
                                <PlusCircle
                                    size={18}
                                    color="#b81d24"
                                    strokeWidth={2}
                                />
                            </button>

                            <button
                                style={styles.actionIconButton}
                                title="Pesquisar"
                            >
                                <Search
                                    size={18}
                                    color="#666"
                                    strokeWidth={2}
                                />
                            </button>

                            <button
                                style={styles.actionIconButton}
                                title="Filtrar"
                            >
                                <ListFilter
                                    size={18}
                                    color="#666"
                                    strokeWidth={2}
                                />
                            </button>
                        </div>
                    </div>

                    <div style={styles.emptyStateContainer}>
                        <p style={styles.emptyText}>
                            Nenhum chamado encontrado
                        </p>

                        <span style={styles.emptySubtext}>
                            Clique no botão + acima para abrir um novo chamado.
                        </span>
                    </div>
                </section>

                <section style={styles.detailColumn}>
                    <div style={styles.detailPlaceholder}>
                        <FileText
                            size={48}
                            color="#cccccc"
                            strokeWidth={1.5}
                        />

                        <p style={styles.detailPlaceholderText}>
                            Selecione um chamado para visualizar os detalhes
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

const styles = {
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#ffffff',
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        overflow: 'hidden'
    },
    header: {
        height: '60px',
        borderBottom: '1px solid #eaeaea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: '#ffffff',
        zIndex: 10
    },
    brandTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#000000'
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px'
    },
    avatarCircle: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#b81d24',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userDropdown: {
        position: 'absolute',
        right: 0,
        top: '40px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        padding: '8px 0',
        width: '140px',
        zIndex: 100
    },
    dropdownItem: {
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '13px',
    color: '#b81d24',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
    },
    mainContent: {
        display: 'flex',
        flex: 1,
        height: 'calc(100vh - 60px)',
        overflow: 'hidden'
    },
    sidebar: {
        width: '240px',
        borderRight: '1px solid #eaeaea',
        backgroundColor: '#fbfbfb',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column'
    },
    sidebarHeader: {
        marginBottom: '20px',
        paddingLeft: '8px'
    },
    sidebarTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#000000',
        margin: 0
    },
    menuList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#555555',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'left'
    },
    menuItemActive: {
        backgroundColor: '#e0e0e0',
        color: '#000000',
        fontWeight: '600'
    },
    menuItemLeft: {
        display: 'flex',
        alignItems: 'center'
    },
    badge: {
        fontSize: '11px',
        color: '#888888'
    },
    ticketsColumn: {
        width: '320px',
        borderRight: '1px solid #eaeaea',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
    },
    ticketsHeader: {
        padding: '20px 20px 16px 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    ticketsTitle: {
        fontSize: '18px',
        fontWeight: '700',
        margin: '0 0 2px 0',
        color: '#000000'
    },
    ticketsSubtitle: {
        fontSize: '11px',
        color: '#888888'
    },
    ticketsActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    actionIconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyStateContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '40px 20px',
        textAlign: 'center'
    },
    emptyText: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333333',
        margin: '0 0 6px 0'
    },
    emptySubtext: {
        fontSize: '12px',
        color: '#888888',
        lineHeight: '1.4'
    },
    detailColumn: {
        flex: 1,
        backgroundColor: '#f9f9fb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
    },
    detailPlaceholder: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
    },
    detailPlaceholderText: {
        fontSize: '14px',
        color: '#999999'
    }
};