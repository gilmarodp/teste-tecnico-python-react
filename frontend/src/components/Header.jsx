import { useState } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserName('João Silva');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Meu Sistema</h1>

        <nav className="flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="mr-4">Olá, {userName}</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Sair
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Registrar
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
