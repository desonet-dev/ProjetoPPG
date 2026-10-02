import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

export function Cadastro() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        celular: '',
        senha: '',
        confirmarSenha: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }

        setFormData((prev) => ({ ...prev, celular: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem.');
            return;
        }

        if (formData.senha.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, formData.email, formData.senha);

            navigate('/home');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está em uso.');
            } else {
                setError('Erro ao criar conta. Verifique os dados fornecidos.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.formCard}>
                <div style={styles.iconContainer}>
                    <LockKeyhole
                        size={28}
                        color="#b81d24"
                        strokeWidth={2.2}
                    />
                </div>

                <h1 style={styles.title}>Cadastrar conta</h1>
                <p style={styles.subtitle}>
                    Insira seus dados para criar sua conta institucional.
                </p>

                {error && <div style={styles.errorMessage}>{error}</div>}

                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={formData.nome}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <input
                        type="tel"
                        name="celular"
                        placeholder="Número de celular"
                        value={formData.celular}
                        onChange={handlePhoneChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="senha"
                        placeholder="Senha"
                        value={formData.senha}
                        onChange={handleChange}
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

                <div style={styles.inputGroup}>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmarSenha"
                        placeholder="Confirmar senha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.togglePasswordBtn}
                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                        {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                </div>

                <div style={styles.loginLinkContainer}>
                    <Link to="/" style={styles.redLink}>
                        Já possui conta?
                    </Link>
                </div>

                <button type="submit" style={styles.submitBtn} disabled={loading}>
                    {loading ? 'Carregando...' : 'Continuar'}
                </button>

                <p style={styles.legalText}>
                    Ao continuar, você concorda com os{' '}
                    <a href="#termos" style={styles.legalLink}>Termos de Uso</a> e{' '}
                    <a href="#politica" style={styles.legalLink}>Política de Privacidade</a> do aplicativo.
                </p>
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
        margin: '0 0 28px 0',
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
        marginBottom: '16px'
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
    loginLinkContainer: {
        width: '100%',
        textAlign: 'left',
        marginTop: '4px',
        marginBottom: '24px'
    },
    redLink: {
        color: '#b81d24',
        fontSize: '13px',
        textDecoration: 'underline',
        fontWeight: '500'
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
        marginBottom: '24px'
    },
    legalText: {
        fontSize: '12px',
        color: '#777777',
        textAlign: 'center',
        lineHeight: '1.5',
        margin: '0'
    },
    legalLink: {
        color: '#333333',
        fontWeight: '600',
        textDecoration: 'underline'
    }
};