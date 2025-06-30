"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getProjectById, updateProject } from '@/app/utils/api';

const UpdateProject = () => {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [project, setProject] = useState(null);
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        setValue,
        reset 
    } = useForm();

    // Cargar datos del proyecto
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const token = Cookies.get('jwt') || localStorage.getItem('jwt'); 

                if (!token) {
                    console.error("Token no encontrado");
                    router.push('/login');
                    return;
                }

                const response = await getProjectById(projectId, token);

                const projectData = response.data;
                
                setProject(projectData);
                
                // Llenar el formulario con los datos existentes
                setValue('name', projectData.name || '');
                setValue('code', projectData.code || '');
                setValue('description', projectData.description || '');
                
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el proyecto:", error);
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId, setValue, router]);

    // Manejar envío del formulario
    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const token = Cookies.get('jwt') || localStorage.getItem('jwt');
            
            await updateProject(token, projectId, data);
            console.log("projectId:", projectId);
            console.log("Datos del proyecto actualizados:", data);

            // Redirigir de vuelta a la lista de proyectos
            router.push('/PaginaGestion/Proyectos');
            
        } catch (error) {
            console.error("Error al actualizar el proyecto:", error);
            alert('Error al actualizar el proyecto. Por favor, intenta de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando proyecto...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">No se pudo cargar el proyecto</p>
                    <Link href="/PaginaGestion/Proyectos">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Volver a proyectos
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Editar Proyecto</h1>
                            <p className="text-gray-600 mt-2">
                                Modifica los datos del proyecto: <span className="font-semibold">{project.name}</span>
                            </p>
                        </div>
                        <Link href="/PaginaGestion/Proyectos">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Volver</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Nombre del Proyecto */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Proyecto *
                            </label>
                            <input
                                type="text"
                                id="name"
                                {...register('name', { 
                                    required: 'El nombre del proyecto es obligatorio',
                                    minLength: {
                                        value: 2,
                                        message: 'El nombre debe tener al menos 2 caracteres'
                                    }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Introduce el nombre del proyecto"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Código Interno */}
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                                Código Interno
                            </label>
                            <input
                                type="text"
                                id="code"
                                {...register('code')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Código interno opcional"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                {...register('description')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe brevemente el proyecto..."
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <Link href="/PaginaGestion/Proyectos">
                                <button
                                    type="button"
                                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Guardar Cambios</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Información adicional */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Información del proyecto</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>Creado: {new Date(project.createdAt).toLocaleDateString('es-ES')}</p>
                                {project.updatedAt && (
                                    <p>Última actualización: {new Date(project.updatedAt).toLocaleDateString('es-ES')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProject;