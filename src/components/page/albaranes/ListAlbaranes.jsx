"use client";

import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import AddAlbaranes from './AddAlbaranes';
import { getAlbaran, getAlbaranes, getClients, getProjects } from '@/app/utils/api';



const ListAlbaranes = () => {

    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [clients, setClients] = useState([]); 
    const [projects, setProjects] = useState([]);
    const [albaranes, setAlbaranes] = useState([]); 
    const [selectedAlbaran, setSelectedAlbaran] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    const token = Cookies.get('token') || localStorage.getItem('token');
    const [selectedProject, setSelectedProject] = useState(null);


    // Obtener clientes
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsData = await getClients(token);
                setClients(clientsData);
                console.log("Clientes obtenidos:", clientsData);
            } catch (error) {
                console.error("Error al obtener clientes:", error);
            }
        };
        fetchClients();
    }, [userId]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects(token);
                setProjects(response.data);
                console.log("Proyectos obtenidos:", response.data);
            } catch (error) {
                console.error("Error al obtener proyectos:", error);
            }
        };
        fetchProjects();
    }, [userId]);

    // Obtener albaranes
    useEffect(() => {
        const fetchAlbaranes = async () => {
            try {
                const response = await getAlbaranes(token);
                setAlbaranes(response.data);
                console.log("Albaranes obtenidos:", response.data);
            } catch (error) {
                console.error("Error al obtener albaranes:", error);
            }
        };
        fetchAlbaranes();
    }, [userId]);

    const handleSelectAlbaran = (albaran) => {
        setSelectedAlbaran(albaran);
    };
     // Función para obtener el nombre del cliente por ID
    const getClientName = (clientId) => {
        const client = clients.find(client => client._id === clientId);
        return client ? client.name : 'Cliente no encontrado';
    };

    // Función para obtener el nombre del proyecto por ID
    const getProjectName = (projectId) => {
        const project = projects.find(project => project._id === projectId);
        return project ? project.name : 'Proyecto no encontrado';
    };

    const onSubmit = async(data) => {
        try {
            console.log("Datos del formulario:", data);
            // Aquí agregarías la lógica para crear/filtrar albaranes
        } catch (error) {
            console.error("Error en submit:", error);
            setErrorMessage("Error al procesar la solicitud");
        }
    };

    // Función para manejar la selección de proyecto
const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedAlbaran(null); // Resetear albarán seleccionado
    // Aquí cargarías los albaranes del proyecto seleccionado
    loadAlbaranesByProject(project._id);
};

// Función para cargar albaranes por proyecto
const loadAlbaranesByProject = async (projectId) => {
    try {
        // Aquí harías la llamada a tu API para obtener albaranes por proyecto
        const response = await fetch(`/api/albaranes/project/${projectId}`);
        const projectAlbaranes = await response.json();
        setAlbaranes(projectAlbaranes);
    } catch (error) {
        console.error('Error loading project albaranes:', error);
    }
};

    
  


   return (
    <div>
        <div className="flex">
            {/* Filtros */}
            <div className="w-1/3 p-4 border-r">
                <h2 className="text-lg font-bold mb-4">Filtros</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Seleccionar Cliente
                        </label>
                        <select 
                            {...register('client')}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los clientes</option>
                            {clients.map((client) => (
                                <option key={client._id} value={client._id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {errorMessage && (
                        <div className='text-sm font-medium text-red-600'>
                            {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Filtrar Proyectos
                    </button>
                </form>
            </div>

            {/* Lista de Proyectos */}
            <div className="w-1/3 p-4 border-r">
                <h2 className="text-lg font-bold mb-4">Proyectos</h2>
                
                {projects.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mb-4">
                            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-gray-500 mb-4">No tienes ningún proyecto</p>
                        <button 
                            onClick={() => {/* Aquí iría la función para crear proyecto */}}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Crear Proyecto
                        </button>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {projects.map((project) => (
                            <li
                                key={project._id}
                                className={`p-3 rounded cursor-pointer transition-colors ${
                                    selectedProject?._id === project._id 
                                        ? 'bg-blue-100 border-l-4 border-blue-500' 
                                        : 'hover:bg-gray-100 border border-gray-200'
                                }`}
                                onClick={() => handleSelectProject(project)}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{project.name}</span>
                                    {project.client && (
                                        <span className="text-sm text-gray-500">
                                            Cliente: {getClientName(project.clientId)}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400">
                                        {project.albaranesCount || 0} albaranes
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Lista de Albaranes del Proyecto Seleccionado */}
            <div className="w-1/3 p-4">
                {selectedProject ? (
                    <div>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold">
                                Albaranes - {selectedProject.name}
                            </h2>
                        </div>

                        {/* Mostrar albaranes del proyecto o mensaje para crear */}
                        {albaranes.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="mb-4">
                                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 mb-4">Este proyecto no tiene albaranes</p>
                                <div className="space-y-2">
                                    <AddAlbaranes projectId={selectedProject._id} />
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Botón para agregar nuevo albarán */}
                                <div className="mb-4">
                                    <AddAlbaranes projectId={selectedProject._id} />
                                </div>

                                {/* Lista de albaranes */}
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {albaranes.map((albaran) => (
                                        <div
                                            key={albaran._id}
                                            className={`p-3 rounded cursor-pointer transition-colors ${
                                                selectedAlbaran?._id === albaran._id 
                                                    ? 'bg-green-100 border-l-4 border-green-500' 
                                                    : 'hover:bg-gray-100 border border-gray-200'
                                            }`}
                                            onClick={() => handleSelectAlbaran(albaran)}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {albaran.number || `Albarán #${albaran._id.slice(-6)}`}
                                                </span>
                                                {albaran.date && (
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(albaran.date).toLocaleDateString('es-ES')}
                                                    </span>
                                                )}
                                                {albaran.total && (
                                                    <span className="text-sm text-green-600 font-medium">
                                                        €{albaran.total.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Detalles del Albarán Seleccionado */}
                        {selectedAlbaran && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Detalles del Albarán
                                </h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Número:</span>
                                        <p className="font-medium">
                                            {selectedAlbaran.number || `#${selectedAlbaran._id.slice(-6)}`}
                                        </p>
                                    </div>

                                    {selectedAlbaran.date && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Fecha:</span>
                                            <p className="font-medium">
                                                {new Date(selectedAlbaran.date).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {selectedAlbaran.description && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Descripción:</span>
                                            <p className="font-medium">{selectedAlbaran.description}</p>
                                        </div>
                                    )}

                                    {selectedAlbaran.total && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Total:</span>
                                            <p className="font-medium text-xl text-green-600">
                                                €{selectedAlbaran.total.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-lg">Selecciona un proyecto para ver sus albaranes</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default ListAlbaranes;
