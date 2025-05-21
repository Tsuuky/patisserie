import { useEffect, useState } from 'react';
import axios from 'axios';

// --- Configuration globale d'Axios ---
axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;

export default function RegisterRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  // Au montage, on charge les demandes
  useEffect(() => {
    fetchRequests();
  }, []);

  // GET /registerrequests
  const fetchRequests = async () => {
    try {
      const res = await axios.get('/registerrequests');
      console.log('Données reçues du serveur:', res.data);
      setRequests(res.data);
      setError('');
    } catch (err) {
      console.error('Erreur de chargement des demandes :', err.response || err);
      setError('Impossible de charger les demandes. Vérifie que tu es bien connecté en tant qu’admin.');
    }
  };

  // POST /registerrequests/:id/approve
  const approve = async (id) => {
    try {
      await axios.post(`/registerrequests/${id}/approve`);
      fetchRequests();
    } catch (err) {
      console.error("Erreur lors de l'approbation :", err.response || err);
      setError("Erreur lors de l'approbation");
    }
  };

  // DELETE /registerrequests/:id
  const reject = async (id) => {
    try {
      await axios.delete(`/registerrequests/${id}`);
      fetchRequests();
    } catch (err) {
      console.error('Erreur lors du rejet :', err.response || err);
      setError('Erreur lors du rejet');
    }
  };

  // Affichage
  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h1 className="text-2xl font-bold mb-4">Demandes d’inscription</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-600">Aucune demande d’inscription pour le moment.</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((req) => (
            <li
              key={req.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span>
                {req.username} (le{' '}
                {new Date(req.createdAt).toLocaleDateString()})
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => approve(req.id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Approuver
                </button>
                <button
                  onClick={() => reject(req.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Rejeter
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
