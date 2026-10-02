import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, senha);

            navigate('/home');
        } catch (err) {
            setError('E-mail ou senha incorretos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.formCard}>
                <div style={styles.iconContainer}>
                    <LockKeyhole
                        size={28}
                        color="#b81d24"
                        strokeWidth={2.2}
                    />
                </div>

                <h1 style={styles.title}>Acessar conta</h1>
                <p style={styles.subtitle}>
                    Insira seus dados para entrar na sua conta de instituição.
                </p>

                {error && <div style={styles.errorMessage}>{error}</div>}

                <div style={styles.inputGroup}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.togglePasswordBtn}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                </div>

                <div style={styles.forgotPasswordContainer}>
                    <a href="#esqueceu-senha" style={styles.redLink}>
                        Esqueceu sua senha?
                    </a>
                </div>

                <div style={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={styles.checkbox}
                    />
                    <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                        Mantenha-me conectado
                    </label>
                </div>

                <button type="submit" style={styles.submitBtn} disabled={loading}>
                    {loading ? 'Carregando...' : 'Continuar'}
                </button>

                <div style={styles.registerLinkContainer}>
                    <Link to="/cadastro" style={styles.redLink}>
                        Não possui conta?
                    </Link>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: '20px',
        boxSizing: 'border-box'
    },
    formCard: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    iconContainer: {
        marginBottom: '16px'
    },
    title: {
        fontSize: '26px',
        fontWeight: '700',
        color: '#000000',
        margin: '0 0 8px 0',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: '14px',
        color: '#666666',
        margin: '0 0 32px 0',
        textAlign: 'center',
        lineHeight: '1.4'
    },
    errorMessage: {
        width: '100%',
        backgroundColor: '#ffebe9',
        color: '#b81d24',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
        textAlign: 'center',
        boxSizing: 'border-box'
    },
    inputGroup: {
        width: '100%',
        position: 'relative',
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '16px 24px',
        borderRadius: '30px',
        border: '1px solid #d0d0d0',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#333333',
        backgroundColor: '#ffffff'
    },
    togglePasswordBtn: {
        position: 'absolute',
        right: '18px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        color: '#666666',
        padding: '4px',
        cursor: 'pointer'
    },
    forgotPasswordContainer: {
        width: '100%',
        textAlign: 'left',
        marginTop: '-8px',
        marginBottom: '16px'
    },
    checkboxContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '32px'
    },
    checkbox: {
        width: '18px',
        height: '18px',
        marginRight: '10px',
        cursor: 'pointer',
        accentColor: '#b81d24'
    },
    checkboxLabel: {
        fontSize: '14px',
        color: '#666666',
        cursor: 'pointer'
    },
    submitBtn: {
        width: '100%',
        padding: '16px',
        borderRadius: '30px',
        backgroundColor: '#b81d24',
        color: '#ffffff',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '20px'
    },
    registerLinkContainer: {
        textAlign: 'center'
    },
    redLink: {
        color: '#b81d24',
        fontSize: '13px',
        textDecoration: 'underline',
        fontWeight: '500'
    }
};