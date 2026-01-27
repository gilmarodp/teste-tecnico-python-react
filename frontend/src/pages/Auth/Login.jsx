import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import api from '../../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token, user_name } = response.data;

            Cookies.set('token', access_token, {
                expires: 2/24,
            });

            Cookies.set('user_name', user_name, {
                expires: 2/24,
            })

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Falha ao realizar login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-md p-8 bg-slate-800 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">Login</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Digite sua senha"
                                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                            >
                                {showPassword ? <EyeClosedIcon className='text-white cursor-pointer' /> : <EyeIcon className='text-white cursor-pointer' />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 mt-6 font-semibold rounded-lg transition cursor-pointer 
                            ${loading 
                                ? 'bg-blue-800 text-gray-300 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-4">
                    Não tem conta?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                    >
                        Cadastre-se aqui
                    </button>
                </p>
            </div>
        </div>
    );
}