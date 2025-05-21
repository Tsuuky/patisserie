import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './components/Sidebar';
import Ingredient from './pages/ingredient';
import Recettes from './pages/recettes';
import PDFGenerator from './pages/PDFGenerator';
import AlertesDLC from './pages/alertDLC';
import RegisterRequests from './pages/RegisterRequests';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const { token, logout } = useAuth();
  const [page, setPage] = useState('login');

  // Si pas authentifié, gérer login et inscription
  if (!token) {
    return (
      page === 'login' ?
        <Login setPage={setPage} /> :
      page === 'register' ?
        <Register setPage={setPage} /> :
        <Login setPage={setPage} />
    );
  }

  // Rendu des pages authentifiées
  const renderPage = () => {
    switch (page) {
      case 'ingredient':
        return <Ingredient />;
      case 'recettes':
        return <Recettes />;
      case 'pdf':
        return <PDFGenerator />;
      case 'alertes':
        return <AlertesDLC />;
      case 'requests':
        return <RegisterRequests />;
      default:
        return <Ingredient />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar setPage={setPage} logout={logout} />
      <main className="flex-1 bg-gray-100">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
