import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Login } from './pages/Login.jsx';
import { Cadastro } from './pages/Cadastro.jsx';
import { Home } from './pages/Home.tsx';
import { ProtectedRoute } from './components/protectedRoute.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
