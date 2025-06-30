"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getClients } from '@/app/utils/api';
import Cookies from 'js-cookie';

const ListClients = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
    };



    useEffect(() => {
        const fetchUserClients = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const token = Cookies.get('jwt') || localStorage.getItem('jwt');

                
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const clientes = await getClients(token);
                console.log("Token utilizado:", token);
                console.log("Clientes obtenidos:", clientes);
                setClients(clientes || []);
                
            } catch (error) {
                console.error("Error al obtener a los clientes", error);
                setError(error.message || 'Error al cargar los clientes');
            } finally {
                setLoading(false);
            }
        };

        fetchUserClients();
    }, [userId]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Cargando clientes...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="flex h-full">
            {/* Listado de Clientes */}
            <div className="w-1/3 p-4 border-r bg-gray-50">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Listado de Clientes</h2>
                
                {clients.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                        No hay clientes disponibles
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {clients.map((client) => (
                            <li
                                key={client._id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                    selectedClient?._id === client._id
                                        ? 'bg-blue-100 border border-blue-300'
                                        : 'bg-white hover:bg-gray-100 border border-gray-200'
                                }`}
                                onClick={() => handleSelectClient(client)}
                            >
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-800">{client.name}</span>
                                </div>
                                {client.cif && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        CIF: {client.cif}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Detalles del Cliente Seleccionado */}
            <div className="w-2/3 p-6 bg-white">
                {selectedClient ? (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedClient.name}
                        </h1>
                        <h2 className="text-lg font-semibold mb-4 text-gray-600">
                            Detalles del Cliente
                        </h2>
                        
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <strong className="text-gray-700">CIF:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {selectedClient.cif || 'No especificado'}
                                    </span>
                                </div>
                                
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <strong className="text-gray-700">Proyectos Activos:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {selectedClient.activeProjects || 0}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <strong className="text-gray-700">Albaranes Pendientes:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {selectedClient.pendingDeliveryNotes || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Dirección */}
                            {selectedClient.address && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Dirección:</h3>
                                    <div className="space-y-1 text-gray-900">
                                        {selectedClient.address.street && (
                                            <p>
                                                <strong>Calle:</strong> {selectedClient.address.street}
                                                {selectedClient.address.number && ` ${selectedClient.address.number}`}
                                            </p>
                                        )}
                                        {selectedClient.address.postal && (
                                            <p><strong>Código postal:</strong> {selectedClient.address.postal}</p>
                                        )}
                                        {selectedClient.address.city && (
                                            <p><strong>Ciudad:</strong> {selectedClient.address.city}</p>
                                        )}
                                        {selectedClient.address.country && (
                                            <p><strong>País:</strong> {selectedClient.address.country}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Información adicional */}
                            {selectedClient.email && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <strong className="text-gray-700">Email:</strong>
                                    <span className="ml-2 text-gray-900">{selectedClient.email}</span>
                                </div>
                            )}

                            {selectedClient.phone && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <strong className="text-gray-700">Teléfono:</strong>
                                    <span className="ml-2 text-gray-900">{selectedClient.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-4">👥</div>
                            <p>Selecciona un cliente para ver los detalles</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListClients;