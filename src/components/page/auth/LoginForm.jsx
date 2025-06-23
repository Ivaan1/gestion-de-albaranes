'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/utils/api';
import Loading from '@/components/menu/loading';

const LoginForm = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Validación de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    let token = null;

    try {
      // Validaciones mejoradas
      if (!formData.email || !formData.password) {
        setErrorMessage("Por favor ingresa tu correo y contraseña.");
        setIsLoading(false);
        return;
      }

      if (!isValidEmail(formData.email)) {
        setErrorMessage("Por favor ingresa un correo electrónico válido.");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
        setIsLoading(false);
        return;
      }

      token = await loginUser(formData);

      if (token) {
        Cookies.set('jwt', token);
        router.push('/PaginaGestion');
      } else {
        setErrorMessage("Usuario o contraseña no válidos");
        // Mantener el email pero limpiar la contraseña
        setFormData(prevState => ({
          ...prevState,
          password: ""
        }));
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      
      // Mensajes de error más específicos basados en el tipo de error
      if (error.response?.status === 401) {
        setErrorMessage("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else if (error.response?.status === 429) {
        setErrorMessage("Demasiados intentos de inicio de sesión. Intenta más tarde.");
      } else if (error.code === 'NETWORK_ERROR') {
        setErrorMessage("Error de conexión. Verifica tu conexión a internet.");
      } else {
        setErrorMessage("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
      }
      
      // Mantener el email pero limpiar la contraseña en caso de error
      setFormData(prevState => ({
        ...prevState,
        password: ""
      }));
    } finally {
      if (!token) {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        {!isLoading && (
          <div className="w-full max-w-md p-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Título */}
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Iniciar Sesión
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Campo correo */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Correo electrónico
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@correo.com"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base 
                        text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                        placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                        focus:outline-indigo-600 sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Campo contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Contraseña
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base 
                        text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                        placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                        focus:outline-indigo-600 sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Enlace recordar contraseña */}
                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <Link 
                      href="/auth/forgot-password" 
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                {/* Mensaje de error */}
                {errorMessage && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm font-medium text-red-800">
                      {errorMessage}
                    </div>
                  </div>
                )}

                {/* Botón iniciar sesión */}
                <div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 
                      text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                      focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors"
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                ¿No tienes una cuenta?{' '}
                <Link 
                  href="/auth/Register" 
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        )}
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
    </>
  );
};

export default LoginForm;