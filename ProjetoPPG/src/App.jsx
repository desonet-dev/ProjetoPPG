import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Home } from './pages/Home';
import { ProtectedRoute } from './components/protectedRoute';

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