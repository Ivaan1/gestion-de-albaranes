"use client";

import Header from "@/components/menu/Header";
import Sidebar from "@/components/menu/Sidebar";
import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { getClients } from "@/app/utils/api";

const PaginaGestion = () => {

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = Cookies.get("jwt") || localStorage.getItem("jwt");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      //obtenemos los clientes 
      const data = await getClients(token);
      console.log("Token utilizado:", token);
        console.log("Clientes obtenidos:", data);

      if (data) {
        setClientes(data);
      }
      setLoading(false);
    };

    fetchClientes();
  }, []);

  
  return (
    <>
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header animado */}
      <div className="text-center mb-12">
        <h2 className="mb-9 text-center text-4xl font-bold tracking-tight text-gray-900 animate-fade-in-down">
          Bienvenido
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full animate-scale-in"></div>
      </div>
      
      {loading ? (
        // Loading animation
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : clientes.length === 0 ? (
        // Estado vacío animado
        <div className="text-center mt-8 animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md mx-auto hover:shadow-xl transition-shadow duration-300">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/021/249/018/small/confused-man-thinking-of-problem-solution-png.png"
              alt="Sin clientes"
              className="w-[150px] mx-auto mb-6 animate-bounce-slow"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              ¡Comienza tu aventura!
            </h3>
            <p className="text-gray-600 mb-6">
              Aún no tienes ningún cliente. Crea tu primer cliente y empieza a gestionar tu negocio.
            </p>
            <Link  
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold group" 
              href="/PaginaGestion/CrearCliente"
            >
              <span className="mr-2">✨</span>
              Crear mi primer cliente
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        // Lista de clientes animada
        <div className="max-w-6xl mx-auto">
          {/* Botón agregar cliente mejorado */}
          <div className="text-center mb-8 animate-fade-in-up">
            <Link href="/PaginaGestion/CrearCliente">
              <button className="group relative bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-green-600 hover:to-blue-700">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar Cliente</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>

          {/* Grid de clientes */}
          <div className="grid gap-6 md:gap-8">
            {clientes.map((cliente, index) => (
              <div
                key={cliente._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 animate-slide-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar animado */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {cliente.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* Anillo animado */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-ping"></div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {cliente.name}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        Cliente activo
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción mejorados */}
                  <div className="flex space-x-3">
                    <Link href="/PaginaGestion/Clientes">
                      <button className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 group/btn shadow-sm hover:shadow-md">
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-semibold">Ver Detalles</span>
                      </button>
                    </Link>
                    
                    <Link href="/PaginaGestion/Clientes">
                      <button className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 text-purple-600 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 group/btn shadow-sm hover:shadow-md">
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="font-semibold">Editar</span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Barra de progreso animada */}
                <div className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Estadísticas animadas */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-count-up">
                {clientes.length}
              </div>
              <div className="text-gray-600 font-semibold">Total Clientes</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3 animate-count-up">
                {clientes.length}
              </div>
              <div className="text-gray-600 font-semibold">Clientes Activos</div>
            </div>
            
          </div>
        </div>
      )}
    </main>

    {/* Estilos CSS personalizados */}
    <style jsx>{`
      @keyframes fade-in-down {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slide-in-up {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes scale-in {
        from {
          opacity: 0;
          transform: scaleX(0);
        }
        to {
          opacity: 1;
          transform: scaleX(1);
        }
      }

      @keyframes bounce-slow {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }

      @keyframes count-up {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .animate-fade-in-down {
        animation: fade-in-down 0.8s ease-out;
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out both;
      }

      .animate-slide-in-up {
        animation: slide-in-up 0.6s ease-out both;
      }

      .animate-scale-in {
        animation: scale-in 1s ease-out 0.5s both;
      }

      .animate-bounce-slow {
        animation: bounce-slow 3s infinite;
      }

      .animate-count-up {
        animation: count-up 0.8s ease-out 0.3s both;
      }
    `}</style>
   </>
  );
}
export default PaginaGestion;