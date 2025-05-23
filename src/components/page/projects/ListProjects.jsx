"use client";

import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import AddProjects from './AddProjects';
import { getProjects } from '@/app/utils/api';



const ListProjects = () => {

    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [clients, setClients] = useState([]); 
    const [projects, setProjects] = useState([]); 
    const [selectedProject, setSelectedProject] = useState(null); // Estado para el cliente seleccionado
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleSelectProject = (project) => {
      setSelectedProject(project); // Establecer el cliente seleccionado
    };

    const onSubmit = async(data) => {
    
    };


    const fetchUserProject = async () => {
        try {
         const token = Cookies.get('token') || localStorage.getItem('token'); 
         const response = await getProjects(token);
            setProjects (response.data);
            console.log("Proyectos recogidos");
          } catch (error) {
            console.error("Error al obtener a los proyectos", error);
          }
        };
  
   const handleProjectAdded = (newProject) => {
        // Recargar toda la lista desde el servidor
        fetchUserProject();
        
    };

    useEffect(() => {
        fetchUserProject();
    }, []);
  



    return (
        <div>
            <div className='p-4'>
                {/* Pasar la función de actualización como prop */}
                <AddProjects onProjectAdded={handleProjectAdded} />
            </div>
            
            <div className="flex">
                {/* Listado de Proyectos */}
                <div className="w-1/3 p-4 border-r">
                    <h2 className="text-lg font-bold mb-4">Listado de proyectos</h2>
                    <ul>
                        {projects.map((project) => (
                            <li
                                key={project._id}
                                className={`p-3 mb-2 rounded cursor-pointer transition-colors ${
                                    selectedProject?._id === project._id 
                                        ? 'bg-blue-100 border-l-4 border-blue-500' 
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleSelectProject(project)}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{project.name}</span>
                                    <span className="text-sm text-gray-500">{project.projectCode}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Detalles del Proyecto Seleccionado */}
                <div className="w-2/3 p-4">
                    {selectedProject ? (
                        <div className="bg-white">
                            <div className="mb-6">
                                <h1 className='text-2xl font-bold text-gray-900 mb-2'>{selectedProject.name}</h1>
                                <p className="text-gray-600">Código del proyecto: <span className="font-semibold">{selectedProject.projectCode}</span></p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información del Proyecto */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Proyecto</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-gray-600">Nombre:</span>
                                            <p className="font-medium">{selectedProject.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Código del Proyecto:</span>
                                            <p className="font-medium">{selectedProject.projectCode}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Código Interno:</span>
                                            <p className="font-medium">{selectedProject.code}</p>
                                        </div>
                                        
                                    </div>
                                </div>

                                {/* Descripcion */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripcion</h3>
                                    <p className="text-gray-600">{selectedProject.description || 'No hay descripción disponible'}</p>
                                </div>
                            </div>

                            {/* Información adicional si existe */}
                            {(selectedProject.createdAt || selectedProject.updatedAt) && (
                                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Información Adicional</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedProject.createdAt && (
                                            <div>
                                                <span className="text-gray-600">Fecha de Creación:</span>
                                                <p className="font-medium">
                                                    {new Date(selectedProject.createdAt).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                        {selectedProject.updatedAt && (
                                            <div>
                                                <span className="text-gray-600">Última Actualización:</span>
                                                <p className="font-medium">
                                                    {new Date(selectedProject.updatedAt).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg">Selecciona un proyecto para ver los detalles</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListProjects;
