import { useState } from 'react';
import  SERVER_URL  from '../constants/Server';
import { useAuthExported } from '../contexts/AuthContext';

export const useLoginRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuthExported();

    const loginUser = async (credentials: { Correo: string; Contraseña: string; }) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Intentando login con:', credentials);
            const response = await fetch(`${SERVER_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            console.log('Respuesta status:', response.status);
            const data = await response.json();
            console.log('Respuesta data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Error en el login');
            }

            await login(data.token, data.user);
            return data;
        } catch (err: any) {
            console.error('Error en login:', err);
            setError(err.message || 'Error desconocido en el login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (userData: {
        Nombre: string;
        Correo: string;
        Contrasenya: string;
    }) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Intentando registro con:', userData);
            const response = await fetch(`${SERVER_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            console.log('Respuesta status:', response.status);
            const data = await response.json();
            console.log('Respuesta data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }

            return data;
        } catch (err: any) {
            console.error('Error en registro:', err);
            setError(err.message || 'Error desconocido en el registro');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loginUser,
        registerUser,
        loading,
        error,
    };
};
