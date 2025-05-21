"use client";
import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProjects, getClients, addProject } from '@/app/utils/api';


const AddProjects = () => {
    const [showForm, setShowForm] = useState(false);  // Estado para controlar si mostrar el formulario
    const { register, handleSubmit, formState: { errors } } = useForm();
    const searchParams = useSearchParams();  
    const userId = searchParams.get('userId');
    const [clientsname, setClientsname] = useState([]); // Estado para los clientes
    const [clientsId, setClientsId] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de error
    const [ Success, setSuccess ] = useState('');
    

    const handleButtonClick = () => {
      setShowForm(true);  // Al hacer clic, mostrar el formulario
    };

    useEffect(() => {
        const fetchUserClients = async () => {
          try {
            const token = localStorage.getItem("token") || Cookies.get("jwt");
            const clientes = await getClients(token);
 
            const clientesname = clientes.map(client => client.name);
            const clientesId = clientes.map(client => client._id);
            setClientsId(clientesId);
            setClientsname(clientesname);

          } catch (error) {
    
            console.error("Error al obtener a los clientes", error);
          }
        };
        fetchUserClients();
    }, [userId]); // Ejecutar el efecto cuando `userId` cambie


    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("token") || Cookies.get("jwt");

            const payload = {
                name: data.name,
                projectCode: data.projectcode, // Cambiado de 'projectcode' a 'projectCode'
                address: {
                    street: data.address.street,
                    number: data.address.number,
                    postal: data.address.postal,
                    city: data.address.city,
                    province: data.address.province
                },
                code: data.codigointerno, // Cambiado de 'codigointerno' a 'code'
                clientId: data.client,
            };
            console.log("payload:", payload);

            const response = await addProject(token, payload);
            console.log("respuesta de addProject:", response);
            setSuccess("Proyecto creado con éxito!");
            setErrorMessage(null);
    
        } catch (error) {
            setErrorMessage("Ocurrio un error. Intentelo de nuevo mas tarde.");
            setSuccess(null);
        }
      };
  
    return (
      <div>
        <h2 className=' mb-9 text-left text-2xl/9 font-bold tracking-tight text-gray-900'>Agregar Nuevo Proyecto</h2>
        {!showForm ? (
          <button 
            onClick={handleButtonClick} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Crear Proyecto?
          </button>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div>
             <label className="block text-sm/6 font-medium text-gray-900 ">A quien le pertenece este proyecto?</label>
                  <div className='mt-2'>
                  <select 
                   {...register('client', { required: true })}
                    className="border p-2">
                    <option value="">Selecciona un cliente</option>

                    {clientsname.map((name, index) => (
                     <option key={index} value={clientsId[index]}>
                     {name}
                    </option>
                     ))}

                    </select>
                  </div>
           </div> 

           <div>
             <label className="block text-sm/6 font-medium text-gray-900 ">Nombre del proyecto</label>
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el nombre"
                           {...register('name', { required: true })}
                           className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')}
                         />
                    </div>
           </div>

           <div>
                <label className="block text-sm/6 font-medium text-gray-900">Dirección</label>
                <div className="mt-2 space-y-2">
                    <input
                    type="text"
                    placeholder="Calle"
                    {...register('address.street', { required: true })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base
                         text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300
                         placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2
                      focus:outline-indigo-600 sm:text-sm/6"
                    onChange={() => setErrorMessage('')}
                    />

                    <input
                      type="number"
                      placeholder="Número"
                      {...register('address.number', { required: true, valueAsNumber: true })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base
                                 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300
                                 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2
                                 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={() => setErrorMessage('')}
                    />

                    <input
                      type="number"
                      placeholder="Código Postal"
                      {...register('address.postal', { required: true, valueAsNumber: true })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base
                                 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300
                                 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2
                                 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={() => setErrorMessage('')}
                    />

                    <input
                      type="text"
                      placeholder="Ciudad"
                      {...register('address.city', { required: true })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base
                                 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300
                                 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2
                                 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={() => setErrorMessage('')}
                    />

                    <input
                      type="text"
                      placeholder="Provincia"
                      {...register('address.province', { required: true })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base
                                 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300
                                 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2
                                 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={() => setErrorMessage('')}
                    />
                </div>
            </div>

           <div>
             <label className="block text-sm/6 font-medium text-gray-900 ">Codigo interno</label>
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el codigo interno"
                           {...register('codigointerno', { required: true })}
                           className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')}
                         />
                    </div>
           </div>

           <div>
             <label className="block text-sm/6 font-medium text-gray-900 ">Codigo identificador</label>
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el codigo del proyecto"
                           {...register('projectcode', { required: true })}
                           className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')}
                         />
                    </div>
           </div>
           
           <div className='mt-5'>
            {errorMessage && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      {errorMessage}
                 </div>
                )}

            {Success && (
                <div className='text-sm font-medium text-green-600 mb-2'>
                      {Success}
                 </div>
                )}
            </div>

            <div className="mt-4">
              <button 
                type="submit" 
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Crear Proyecto
              </button>
            </div>
          </form>
        )}
      </div>
    );
};
export default AddProjects;
