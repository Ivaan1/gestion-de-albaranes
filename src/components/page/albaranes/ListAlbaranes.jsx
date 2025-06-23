"use client";

import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import Cookies from 'js-cookie';
import AddAlbaranesForm from './AddAlbaranes';
import SignAlbaran from './SignAlbaran';
import { getAlbaranes, getClients, getProjects, generateAlbaranPDF, getSignedPDFUrl  } from '@/app/utils/api';

const ListAlbaranes = () => {
    const [clients, setClients] = useState([]); 
    const [projects, setProjects] = useState([]);
    const [albaranes, setAlbaranes] = useState([]); 
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filteredAlbaranes, setFilteredAlbaranes] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedAlbaran, setSelectedAlbaran] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    
    // Estados para controlar vistas
    const [showSignView, setShowSignView] = useState(false);
    const [albaranToSign, setAlbaranToSign] = useState(null);

    const { register, handleSubmit, watch, setValue } = useForm();

    const token = Cookies.get('token') || localStorage.getItem('token');
    
    const watchedClient = watch('client');

    // Cargar datos iniciales
    useEffect(() => {
        loadInitialData();
    }, []);

    // Filtrar proyectos cuando cambie el cliente seleccionado
    useEffect(() => {
        filterProjects();
        // Resetear proyecto y albarán seleccionados
        setSelectedProject(null);
        setSelectedAlbaran(null);
        setFilteredAlbaranes([]);
    }, [watchedClient, projects]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            // Cargar todo en paralelo
            const [clientsData, projectsResponse, albaranesResponse] = await Promise.all([
                getClients(token),
                getProjects(token),
                getAlbaranes(token)
            ]);

            setClients(clientsData);
            setProjects(projectsResponse.data);
            setAlbaranes(albaranesResponse.data);
            
            console.log("Datos cargados:", {
                clients: clientsData,
                projects: projectsResponse.data,
                albaranes: albaranesResponse.data
            });
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterProjects = () => {
        if (!watchedClient) {
            setFilteredProjects([]);
            return;
        }
        
        const filtered = projects.filter(project => project.clientId === watchedClient);
        setFilteredProjects(filtered);
        setSelectedClient(watchedClient);
    };

    const filterAlbaranesByProject = (projectId) => {
        const filtered = albaranes.filter(albaran => albaran.projectId === projectId);
        setFilteredAlbaranes(filtered);
        setSelectedAlbaran(null); // Reset selección de albarán
    };

    const handleSelectProject = (project) => {
        setSelectedProject(project);
        filterAlbaranesByProject(project._id);
    };

    const handleSelectAlbaran = (albaran) => {
        setSelectedAlbaran(albaran);
    };

    const handleResetFilter = () => {
        setValue('client', '');
        setSelectedClient('');
        setSelectedProject(null);
        setSelectedAlbaran(null);
        setFilteredProjects([]);
        setFilteredAlbaranes([]);
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

    // Callback cuando se crea un albarán nuevo - simplemente recargamos todo
    const handleAlbaranCreated = () => {
        loadInitialData(); // Recargar todos los datos
        // Mantener filtros activos si hay un proyecto seleccionado
        if (selectedProject) {
            filterAlbaranesByProject(selectedProject._id);
        }
    };

    
    const handleGeneratePDF = async (albaranId) => {
        setGeneratingPDF(true);
        try {
            await generateAlbaranPDF(albaranId, token);
            
            console.log('PDF generado correctamente');
            
            // Recargar datos para actualizar el estado
            await loadInitialData();
            
            // Mantener el albarán seleccionado actualizado
            if (selectedProject) {
                filterAlbaranesByProject(selectedProject._id);
            }
            
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
        } finally {
            setGeneratingPDF(false);
        }
    };

    const handleSignAlbaran = (albaran) => {
        setAlbaranToSign(albaran);
        setShowSignView(true);
    };

    
    const handleDownloadPDF = (albaran) => {
        try {
            window.open(albaran.pdfUrl, '_blank');
        } catch (error) {
            console.error('Error abriendo PDF:', error);
            alert('Error al abrir el PDF. Por favor, inténtalo de nuevo.');
        }
    };

    const handleSignComplete = () => {
        setShowSignView(false);
        setAlbaranToSign(null);
        loadInitialData(); // Recargar datos
    };

    const handleCancelSign = () => {
        setShowSignView(false);
        setAlbaranToSign(null);
    };

    const onSubmit = (data) => {
        console.log("Filtros aplicados:", data);
    };

    // Si estamos en vista de firma, mostrar solo el componente de firma
    if (showSignView && albaranToSign) {
        return (
            <SignAlbaran
                albaran={albaranToSign}
                clientName={getClientName(albaranToSign.clientId)}
                projectName={getProjectName(albaranToSign.projectId)}
                onSignComplete={handleSignComplete}
                onCancel={handleCancelSign}
                token={token}
            />
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex">
                {/* Filtros */}
                <div className="w-1/3 p-4 border-r">
                    <h2 className="text-lg font-bold mb-4">Filtros</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Seleccionar Cliente
                            </label>
                            <select
                                {...register('client')}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecciona un cliente</option>
                                {clients.map((client) => (
                                    <option key={client._id} value={client._id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {watchedClient && (
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Cliente: <span className="font-medium">{getClientName(watchedClient)}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                    Limpiar filtro
                                </button>
                            </div>
                        )}

                        {selectedProject && (
                            <div className="text-sm text-gray-600">
                                Proyecto: <span className="font-medium">{selectedProject.name}</span>
                            </div>
                        )}

                        {filteredAlbaranes.length > 0 && (
                            <div className="text-sm text-gray-600">
                                Mostrando {filteredAlbaranes.length} albaranes
                            </div>
                        )}
                    </div>
                </div>

                {/* Lista de Proyectos */}
                <div className="w-1/3 p-4 border-r">
                    <h2 className="text-lg font-bold mb-4">Proyectos</h2>
                    
                    {!watchedClient ? (
                        <div className="text-center py-8">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <p className="text-gray-500">Selecciona un cliente para ver sus proyectos</p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <p className="text-gray-500">Este cliente no tiene proyectos</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {filteredProjects.map((project) => (
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
                                        <span className="text-xs text-gray-400">
                                            ID: {project._id.slice(-6)}
                                        </span>
                                        {project.description && (
                                            <span className="text-sm text-gray-500 mt-1">
                                                {project.description.length > 50 
                                                    ? `${project.description.substring(0, 50)}...`
                                                    : project.description
                                                }
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Lista de Albaranes */}
                <div className="w-1/3 p-4">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-bold">Albaranes</h2>
                        <AddAlbaranesForm 
                            onAlbaranCreated={handleAlbaranCreated}
                            preselectedClient={selectedClient}
                            preselectedProject={selectedProject}
                        />
                    </div>

                    {!selectedProject ? (
                        <div className="text-center py-8">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500">Selecciona un proyecto para ver sus albaranes</p>
                        </div>
                    ) : filteredAlbaranes.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 mb-4">Este proyecto no tiene albaranes</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredAlbaranes.map((albaran) => (
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
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium">
                                                {albaran.albaranCode || `Albarán #${albaran._id.slice(-6)}`}
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                {albaran.pdfGenerated && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        PDF
                                                    </span>
                                                )}
                                                {albaran.signed && (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        Firmado
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {albaran.workdate && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(albaran.workdate).toLocaleDateString('es-ES')}
                                            </span>
                                        )}
                                        {albaran.description && (
                                            <span className="text-sm text-gray-500 mt-1">
                                                {albaran.description.length > 40 
                                                    ? `${albaran.description.substring(0, 40)}...`
                                                    : albaran.description
                                                }
                                            </span>
                                        )}
                                        {albaran.pending && (
                                            <span className="text-xs text-orange-600 font-medium mt-1">
                                                Pendiente
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
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
                                    <span className="text-sm font-medium text-gray-600">Código:</span>
                                    <p className="font-medium">
                                        {selectedAlbaran.albaranCode || `#${selectedAlbaran._id.slice(-6)}`}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-gray-600">Cliente:</span>
                                    <p className="font-medium">{getClientName(selectedAlbaran.clientId)}</p>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-gray-600">Proyecto:</span>
                                    <p className="font-medium">{getProjectName(selectedAlbaran.projectId)}</p>
                                </div>

                                {selectedAlbaran.workdate && (
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Fecha:</span>
                                        <p className="font-medium">
                                            {new Date(selectedAlbaran.workdate).toLocaleDateString('es-ES', {
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

                                <div>
                                    <span className="text-sm font-medium text-gray-600">Formato:</span>
                                    <p className="font-medium capitalize">{selectedAlbaran.format}</p>
                                </div>

                                {selectedAlbaran.materials && selectedAlbaran.materials.length > 0 && (
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Materiales:</span>
                                        <p className="font-medium">{selectedAlbaran.materials.join(', ')}</p>
                                    </div>
                                )}

                                {selectedAlbaran.hours && selectedAlbaran.hours.length > 0 && (
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Horas:</span>
                                        <p className="font-medium">{selectedAlbaran.hours.join(', ')}</p>
                                    </div>
                                )}

                                {selectedAlbaran.pending && (
                                    <div>
                                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                            Pendiente
                                        </span>
                                    </div>
                                )}

                                {/* Estado del PDF y firma */}
                                <div className="flex gap-2">
                                    {selectedAlbaran.pdfGenerated && (
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            PDF Generado
                                        </span>
                                    )}
                                    {selectedAlbaran.signed && (
                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                            Firmado
                                        </span>
                                    )}
                                </div>

                                {/* Botones de Acción */}
                                <div className="mt-4 space-y-2">
                                    {!selectedAlbaran.pdfGenerated && (
                                        <button
                                            onClick={() => handleGeneratePDF(selectedAlbaran._id)}
                                            disabled={generatingPDF}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
                                        >
                                            {generatingPDF ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Generando PDF...
                                                </>
                                            ) : (
                                                'Generar PDF'
                                            )}
                                        </button>
                                    )}

                                    {selectedAlbaran.pdfGenerated && !selectedAlbaran.signed && (
                                        <button
                                            onClick={() => handleSignAlbaran(selectedAlbaran)}
                                            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                                        >
                                            Firmar Albarán
                                        </button>
                                    )}

                                    {selectedAlbaran.signed && (
                                        <button
                                            onClick={() => handleDownloadPDF(selectedAlbaran)}
                                            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Descargar PDF
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListAlbaranes;