import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function Login({ setPage }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
    } catch {
      setError('Identifiants invalides');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Connexion</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Pseudo"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="mb-4 p-2 border rounded w-full"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Se connecter
        </button>

        <p className="mt-4 text-center text-sm">
          Pas encore de compte ?{' '}
          <span
            onClick={() => setPage('register')}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Demandez un compte
          </span>
        </p>
      </form>
    </div>
  );
}
