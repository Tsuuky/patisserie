import { useState } from 'react';
import axios from 'axios';

export default function Register({ setPage }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/register', form);
      setMessage('Demande envoyée ! En attente de validation de l’admin.');
      setForm({ username: '', password: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Erreur lors de la demande');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Demande d’inscription</h1>
        {message && <p className="text-blue-500 mb-2">{message}</p>}
        <input
          type="text"
          name="username"
          placeholder="Pseudo"
          value={form.username}
          onChange={handleChange}
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="mb-4 p-2 border rounded w-full"
        />
        <div className="flex justify-between items-center">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Envoyer la demande
          </button>
          <button
            type="button"
            onClick={() => setPage('login')}
            className="text-sm text-gray-500 hover:underline"
          >
            Retour
          </button>
        </div>
      </form>
    </div>
  );
}
