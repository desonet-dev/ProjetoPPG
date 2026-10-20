import type { CSSProperties } from 'react';

export function LoadingScreen() {
  return (
    <div style={styles.container}>
      <div style={styles.logoWrapper}>
        <div style={styles.ring} />
        <div style={styles.logo}>PPG</div>
      </div>
      <span style={styles.text}>Carregando…</span>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    backgroundColor: '#fbfbfb',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  logoWrapper: {
    position: 'relative',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ring: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '3px solid #f0d3d4',
    borderTopColor: '#b81d24',
    animation: 'girar 0.9s linear infinite'
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#b81d24',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.02em',
    animation: 'pulsar 1.8s ease-in-out infinite'
  },
  text: {
    fontSize: '13px',
    color: '#8e8e93',
    fontWeight: 500
  }
};