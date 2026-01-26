import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Quadro de Tarefas</h1>

        <nav className="flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="mr-4">Olá, {userName}</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                Sair
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                Login
              </button>
              <button onClick={handleRegister} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                Registrar
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
