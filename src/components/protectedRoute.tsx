import { useEffect, useState, type ReactNode, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig.ts';
import { LoadingScreen } from './LoadingScreen.tsx';

interface ProtectedRouteProps {
  children: ReactNode;
}

async function garantirPerfilDoUsuario(user: User): Promise<void> {
  const perfilRef = doc(db, 'usuarios', user.uid);
  const perfilSnapshot = await getDoc(perfilRef);

  if (perfilSnapshot.exists()) {
    return;
  }

  await setDoc(perfilRef, {
    nome: user.displayName || user.email?.split('@')[0] || 'Sem nome',
    email: user.email ?? '',
    cargo: 'aluno',
    status: 'ativo',
    criadoEm: serverTimestamp()
  });
}

function comTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Tempo esgotado ao falar com o Firestore')), timeoutMs)
    )
  ]);
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await comTimeout(garantirPerfilDoUsuario(currentUser), 5000);
        } catch (error) {
          console.error(
            'Não foi possível confirmar/criar o perfil do usuário (login seguiu normalmente):',
            error
          );
        }
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}