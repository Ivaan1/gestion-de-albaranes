"use client";
import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import Cookies from 'js-cookie';
import { addAlbaran, getClients, getProjects } from '@/app/utils/api';

const AddAlbaranesForm = ({ 
    onAlbaranCreated, 
    preselectedClient = null, 
    preselectedProject = null 
}) => {
    const [showForm, setShowForm] = useState(false);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        defaultValues: {
            workdate: new Date().toISOString().split('T')[0]
        }
    });

    const watchedFormat = watch('format');
    const watchedClient = watch('client');
    const token = Cookies.get('jwt') || localStorage.getItem('jwt');

    // Cargar clientes y proyectos cuando se abre el formulario
    useEffect(() => {
        if (showForm && token) {
            loadFormData();
        }
    }, [showForm, token]);

    // Preseleccionar cliente y proyecto cuando se abre el formulario
    useEffect(() => {
        if (showForm && preselectedClient && clients.length > 0) {
            setValue('client', preselectedClient);
            
            // Filtrar proyectos del cliente preseleccionado
            const clientProjects = projects.filter(project => 
                project.clientId === preselectedClient
            );
            setFilteredProjects(clientProjects);
            
            // Si también hay proyecto preseleccionado, seleccionarlo
            if (preselectedProject) {
                setValue('project', preselectedProject._id);
            }
        }
    }, [showForm, preselectedClient, preselectedProject, clients, projects, setValue]);

    // Filtrar proyectos cuando cambie el cliente seleccionado manualmente
    useEffect(() => {
        if (watchedClient) {
            const clientProjects = projects.filter(project => 
                project.clientId === watchedClient
            );
            setFilteredProjects(clientProjects);
            
            // Si el proyecto seleccionado no pertenece al nuevo cliente, limpiarlo
            const currentProjectId = watch('project');
            const projectBelongsToClient = clientProjects.some(p => p._id === currentProjectId);
            if (currentProjectId && !projectBelongsToClient) {
                setValue('project', '');
            }
        } else {
            setFilteredProjects([]);
            setValue('project', '');
        }
    }, [watchedClient, projects, setValue, watch]);

    const loadFormData = async () => {
        try {
            const [clientsData, projectsResponse] = await Promise.all([
                getClients(token),
                getProjects(token)
            ]);
            
            setClients(clientsData);
            setProjects(projectsResponse.data);
            console.log("Datos del formulario cargados:", { clients: clientsData, projects: projectsResponse.data });
        } catch (error) {
            console.error("Error loading form data:", error);
            setErrorMessage("Error al cargar los datos del formulario");
        }
    };

    const handleButtonClick = () => {
        setShowForm(true);
        setErrorMessage(null);
        setSuccess('');
    };

    const handleCancel = () => {
        setShowForm(false);
        setErrorMessage(null);
        setSuccess('');
        setFilteredProjects([]);
        reset({
            workdate: new Date().toISOString().split('T')[0]
        });
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMessage(null);
        
        try {
            const payload = {
                clientId: data.client,
                projectId: data.project,
                format: data.format,
                description: data.description,
                albaranCode: data.albaranCode,
                workdate: data.workdate,
                pending: data.pending || false,
                // Campos condicionales según el formato
                ...(data.format === 'materials' && data.materials && {
                    materials: data.materials.split(',').map(m => m.trim()).filter(m => m)
                }),
                ...(data.format === 'hours' && data.hours && {
                    hours: data.hours.split(',').map(h => parseFloat(h.trim())).filter(h => !isNaN(h))
                })
            };
            
            console.log("Payload a enviar:", payload);
            const response = await addAlbaran(token, payload);
            console.log("Albarán creado:", response);
            
            setSuccess("¡Albarán creado con éxito!");
            
            // Notificar al componente padre después de 1 segundo
            setTimeout(() => {
                if (onAlbaranCreated && typeof onAlbaranCreated === 'function') {
                    onAlbaranCreated();
                }
                
                // Cerrar y resetear el formulario
                setShowForm(false);
                setSuccess('');
                setFilteredProjects([]);
                reset({
                    workdate: new Date().toISOString().split('T')[0]
                });
            }, 1000);
   
        } catch (error) {
            console.error("Error creating albaran:", error);
            setErrorMessage(error.response?.data?.message || "Error al crear el albarán");
        } finally {
            setLoading(false);
        }
    };

    // Obtener el nombre del cliente preseleccionado
    const getClientName = (clientId) => {
        const client = clients.find(client => client._id === clientId);
        return client ? client.name : '';
    };

    // Obtener el nombre del proyecto preseleccionado
    const getProjectName = (projectId) => {
        const project = projects.find(project => project._id === projectId);
        return project ? project.name : '';
    };
  
    return (
        <div>
            {!showForm ? (
                <button 
                    onClick={handleButtonClick} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                    + Nuevo Albarán
                </button>
            ) : (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Nuevo Albarán</h3>
                            <button 
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Mostrar información preseleccionada */}
                        {(preselectedClient || preselectedProject) && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-sm text-blue-800">
                                    <span className="font-medium">Preseleccionado:</span>
                                    {preselectedClient && (
                                        <div>Cliente: {getClientName(preselectedClient)}</div>
                                    )}
                                    {preselectedProject && (
                                        <div>Proyecto: {getProjectName(preselectedProject._id)}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mensajes de estado */}
                        {errorMessage && (
                            <div className='text-sm font-medium text-red-600 mb-4 p-3 bg-red-50 rounded border border-red-200'>
                                {errorMessage}
                            </div>
                        )}

                        {success && (
                            <div className='text-sm font-medium text-green-600 mb-4 p-3 bg-green-50 rounded border border-green-200'>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            
                            {/* Código de Albarán */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Código de Albarán *
                                </label>
                                <input
                                    type="text"
                                    {...register('albaranCode', { 
                                        required: 'El código de albarán es obligatorio' 
                                    })}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: ALB-001"
                                />
                                {errors.albaranCode && (
                                    <span className="text-red-500 text-sm">{errors.albaranCode.message}</span>
                                )}
                            </div>

                            {/* Cliente */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Cliente *
                                </label>
                                <select 
                                    {...register('client', { 
                                        required: 'Debe seleccionar un cliente' 
                                    })}
                                    disabled={preselectedClient && !watchedClient}
                                    className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        preselectedClient && !watchedClient ? 'bg-gray-100' : ''
                                    }`}
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {clients.map((client) => (
                                        <option key={client._id} value={client._id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.client && (
                                    <span className="text-red-500 text-sm">{errors.client.message}</span>
                                )}
                            </div>

                            {/* Proyecto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Proyecto *
                                </label>
                                <select 
                                    {...register('project', { 
                                        required: 'Debe seleccionar un proyecto' 
                                    })}
                                    disabled={preselectedProject && !watch('project')}
                                    className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        preselectedProject && !watch('project') ? 'bg-gray-100' : ''
                                    }`}
                                >
                                    <option value="">Seleccionar proyecto</option>
                                    {(filteredProjects.length > 0 ? filteredProjects : projects).map((project) => (
                                        <option key={project._id} value={project._id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.project && (
                                    <span className="text-red-500 text-sm">{errors.project.message}</span>
                                )}
                                {watchedClient && filteredProjects.length === 0 && (
                                    <small className="text-gray-500">Este cliente no tiene proyectos disponibles</small>
                                )}
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Descripción *
                                </label>
                                <textarea
                                    {...register('description', { 
                                        required: 'La descripción es obligatoria',
                                        minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                                    })}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Descripción del trabajo realizado..."
                                />
                                {errors.description && (
                                    <span className="text-red-500 text-sm">{errors.description.message}</span>
                                )}
                            </div>

                            {/* Formato */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Formato *
                                </label>
                                <select
                                    {...register('format', { 
                                        required: 'Debe seleccionar un formato' 
                                    })}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccionar formato</option>
                                    <option value="materials">Materiales</option>
                                    <option value="hours">Horas</option>
                                </select>
                                {errors.format && (
                                    <span className="text-red-500 text-sm">{errors.format.message}</span>
                                )}
                            </div>

                             {/* Materiales - Solo si format es 'materials' */}
                            {watchedFormat === 'materials' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">
                                        Materiales
                                    </label>
                                    <input
                                        type="text"
                                        {...register('materials')}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="cemento, arena, ladrillos"
                                    />
                                    <small className="text-gray-500">Separar cada material con comas</small>
                                </div>
                            )}

                            {/* Horas - Solo si format es 'hours' */}
                            {watchedFormat === 'hours' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">
                                        Horas
                                    </label>
                                    <input
                                        type="text"
                                        {...register('hours')}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="4, 3.5, 2"
                                    />
                                    <small className="text-gray-500">Separar cada cantidad de horas con comas</small>
                                </div>
                            )}

                            {/* Fecha de trabajo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Fecha de trabajo *
                                </label>
                                <input
                                    type="date"
                                    {...register('workdate', { 
                                        required: 'La fecha de trabajo es obligatoria' 
                                    })}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.workdate && (
                                    <span className="text-red-500 text-sm">{errors.workdate.message}</span>
                                )}
                            </div>

                             {/* Estado pendiente */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('pending')}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="text-sm font-medium text-gray-900">
                                    Marcar como pendiente
                                </label>
                            </div>

                            {/* Botones */}
                            <div className="flex space-x-3 pt-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className={`flex-1 px-4 py-2 rounded-md text-white transition-colors ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                >
                                    {loading ? 'Creando...' : 'Crear Albarán'}
                                </button>
                                
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAlbaranesForm;