"use client";
import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { getProjects, getClients, addProject } from '@/app/utils/api';


const AddProjects = ({ onProjectAdded }) => {
    const [showForm, setShowForm] = useState(false);  // Estado para controlar si mostrar el formulario
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [clientsname, setClientsname] = useState([]); // Estado para los clientes
    const [clientsId, setClientsId] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de error
    const [success, setSuccess] = useState('');
    

    const handleButtonClick = () => {
      setShowForm(true);  // Al hacer clic, mostrar el formulario
    };

    useEffect(() => {
        const fetchUserClients = async () => {
          try {
            const token = Cookies.get('jwt') || localStorage.getItem('jwt');
            
            const clientes = await getClients(token);

            console.log("Token utilizado:", token);
            console.log("Clientes obtenidos:", clientes);
 
            const clientesname = clientes.map(client => client.name);
            const clientesId = clientes.map(client => client._id);
            setClientsId(clientesId);
            setClientsname(clientesname);

          } catch (error) {
    
            console.error("Error al obtener a los clientes", error);
          }
        };
        fetchUserClients();
    }, []); // Sin dependencias ya que no necesitas userId


    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("jwt") || Cookies.get("jwt");

            const payload = {
                name: data.name,
                projectCode: data.projectcode,
                description: data.description,
                code: data.codigointerno,
                clientId: data.client,
            };
            console.log("payload:", payload);

            const response = await addProject(token, payload);
            console.log("respuesta completa de addProject:", response);
            
            setSuccess("Proyecto creado con éxito!");
            setErrorMessage(null);
            
            // Limpiar el formulario
            reset();
            
            // Ocultar el formulario después de crear exitosamente
            setShowForm(false);
            
            // Llamar la función de callback para actualizar la lista
            if (onProjectAdded) {
                // Intentar diferentes estructuras de respuesta
                const newProject = response.data || response.project || response;
                console.log("Enviando nuevo proyecto:", newProject);
                onProjectAdded(newProject);
            }
    
        } catch (error) {
            console.error("Error completo:", error);
            setErrorMessage("Ocurrió un error. Inténtelo de nuevo más tarde.");
            setSuccess('');
        }
    };

    // Función para cancelar y ocultar el formulario
    const handleCancel = () => {
        setShowForm(false);
        setErrorMessage(null);
        setSuccess('');
        reset();
    };
  
    return (
      <div>
        <h2 className=' mb-9 text-left text-2xl/9 font-bold tracking-tight text-gray-900'>Agregar Nuevo Proyecto</h2>
        {!showForm ? (
          <button 
            onClick={handleButtonClick} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Crear Proyecto
          </button>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
             <label className="block text-sm/6 font-medium text-gray-900 ">A quien le pertenece este proyecto?</label>
                  <div className='mt-2'>
                  <select 
                   {...register('client', { required: "Debe seleccionar un cliente" })}
                    className="border p-2 rounded w-full">
                    <option value="">Selecciona un cliente</option>

                    {clientsname.map((name, index) => (
                     <option key={index} value={clientsId[index]}>
                     {name}
                    </option>
                     ))}

                    </select>
                    {errors.client && <p className="text-red-500 text-sm mt-1">{errors.client.message}</p>}
                  </div>
           </div> 

           <div>
             <label className="block text-sm/6 font-medium text-gray-900 ">Nombre del proyecto</label>
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el nombre"
                           {...register('name', { required: "El nombre es requerido" })}
                           className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')}
                         />
                         {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
           </div>
           
           <div>
                <label className="block text-sm/6 font-medium text-gray-900 ">Descripción</label>
                    <div className='mt-2'>
                            <textarea
                            placeholder="Introduce la descripción"
                             {...register('description', { required: "La descripción es requerida" })}
                             className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                             text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                             placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                             focus:outline-indigo-600 sm:text-sm/6'
                             rows="3"
                             onChange={() => setErrorMessage('')}
                             />
                             {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>
            
           </div>

           <div>
             <label className="block text-sm/6 font-medium text-gray-900 ">Código interno</label>
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el código interno"
                           {...register('codigointerno', { required: "El código interno es requerido" })}
                           className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')}
                         />
                         {errors.codigointerno && <p className="text-red-500 text-sm mt-1">{errors.codigointerno.message}</p>}
                    </div>
           </div>

           <div>
             <label className="block text-sm/6 font-medium text-gray-900 ">Código identificador</label>
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el código del proyecto"
                           {...register('projectcode', { required: "El código del proyecto es requerido" })}
                           className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')}
                         />
                         {errors.projectcode && <p className="text-red-500 text-sm mt-1">{errors.projectcode.message}</p>}
                    </div>
           </div>
           
           <div className='mt-5'>
            {errorMessage && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      {errorMessage}
                 </div>
                )}

            {success && (
                <div className='text-sm font-medium text-green-600 mb-2'>
                      {success}
                 </div>
                )}
            </div>

            <div className="mt-4 flex space-x-2">
              <button 
                type="submit" 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Crear Proyecto
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    );
};
export default AddProjects;