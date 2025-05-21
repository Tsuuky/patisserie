import React from 'react';

export default function Sidebar({ setPage, logout }) {
  return (
    <div className="w-64 bg-white shadow-md p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Pâtisserie</h2>
      <nav className="space-y-2">
        <button
          onClick={() => setPage('ingredient')}
          className="w-full text-left hover:bg-gray-100 p-2 rounded"
        >
          Ingrédients
        </button>
        <button
          onClick={() => setPage('recettes')}
          className="w-full text-left hover:bg-gray-100 p-2 rounded"
        >
          Recettes
        </button>
        <button
          onClick={() => setPage('pdf')}
          className="w-full text-left hover:bg-gray-100 p-2 rounded"
        >
          Générer PDF
        </button>
        <button
          onClick={() => setPage('alertes')}
          className="w-full text-left hover:bg-gray-100 p-2 rounded"
        >
          Alertes DLC
        </button>
        <button
          onClick={() => setPage('requests')}
          className="w-full text-left hover:bg-gray-100 p-2 rounded"
        >
          Demandes d’inscription
        </button>
      </nav>
      <button
        onClick={logout}
        className="w-full text-left hover:bg-gray-100 p-2 rounded text-red-500 mt-6"
      >
        Déconnexion
      </button>
    </div>
  );
}
