import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Login } from './pages/Login.jsx';
import { Cadastro } from './pages/Cadastro.jsx';
import { Home } from './pages/Home.tsx';
import { Usuarios } from './pages/Usuarios.tsx';
import { Relatorios } from './pages/Relatorios.tsx';
import { Configuracoes } from './pages/Configuracoes.tsx';
import { ProtectedRoute } from './components/protectedRoute.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}