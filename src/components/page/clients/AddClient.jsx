"use client";

import React, {useState, useRef} from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { addClient } from '@/app/utils/api';



const AddClient = () => {
    
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [Message, setMessage] = useState(null); // Estado para el mensaje de error
  const [ Success, setSuccess ] = useState('');
  const formRef = useRef(null);
  
  const router = useRouter();
  const [showModal, setShowModal] = useState(false); // Controla el modal


  const handleDiscard = () => {
    console.log("Cambios descartados");
    if (formRef.current) {
      formRef.current.reset(); // Restablece el formulario utilizando la referencia
    }
    console.log("Formulario descartado");
    setSuccess("");
  };
  

   const onSubmit = async (data) => {
    try {
        const token = Cookies.get("jwt") || localStorage.getItem("jwt");
        console.log("token : ", token);

        if (!token) {
            console.error("Token no disponible");
            return;
          }

        const clientData = {
            name: data.name,
            email: data.email,
            address: {
              street: data.street,
              number: parseInt(data.number),
              postal: parseInt(data.postal),
              city: data.city,
              province: data.province
            },
            cif: data.cif
        };

        console.log("clientData", clientData);

        await addClient(token , clientData); 
        setSuccess("Cliente agregado exitosamente.");

      setShowModal(true); // Muestra el modal después de crear el cliente

    } catch (error) {
        setMessage("Ocurrio un error. Intentelo de nuevo mas tarde.")
    }
  };

  const handleLinkProject = () => {
    console.log("Vinculando cliente con un proyecto...");
    router.push(`/PaginaGestion/Proyectos`);
    setShowModal(false); // Cierra el modal después de la acción
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal sin vincular
  };


  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-[#e9faff]'>
     

        <div className ="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className ="mt-10 text-left text-2xl/9 font-bold tracking-tight text-gray-900">Nuevo cliente</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        
          <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">Nombre del Cliente o empresa</label>
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el nombre"
                           {...register('name', { required: true })}
                           required className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'                        
                         />
                          {errors.name && <p>{errors.name.message}</p>}
                         
                    </div>
           </div>  

           <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">Correo de la empresa</label>
                  <div className='mt-2'>
                          <input
                          type="email"
                          placeholder="Introduce el correo electronico"
                           {...register('email', { required: true })}
                           required className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'                        
                         />
                          {errors.name && <p>{errors.name.message}</p>}
                         
                    </div>
           </div> 
      

           <div className='mt-4'>
                <label className="block text-sm font-medium text-gray-900 mb-1">Domicilio Fiscal</label>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                    type="text"
                    placeholder="Calle"
                    {...register('street', { required: "La calle es obligatoria" })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
                    />
                    {errors.street && <p>{errors.street.message}</p>}

                    <input
                    type="number"
                    placeholder="Número"
                    {...register('number', { required: "El número es obligatorio" })}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {errors.number && <p>{errors.number.message}</p>}

                    <input
                    type="number"
                    placeholder="Código Postal"
                    {...register('postal', { required: "El código postal es obligatorio" })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {errors.postal && <p>{errors.postal.message}</p>}

                    <input
                    type="text"
                    placeholder="Ciudad"
                    {...register('city', { required: "La ciudad es obligatoria" })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
                    />
                    {errors.city && <p>{errors.city.message}</p>}

                    <input
                    type="text"
                    placeholder="Provincia"
                    {...register("province", { required: "La provincia es obligatoria" })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
                 />
                  {errors.province && <p>{errors.province.message}</p>}
                </div>
            </div>
            
            
            <div className='mt-2'>
                
                 <label  className="block text-sm/6 font-medium text-gray-900">CIF (obligatorio)</label>
                 
                     <div className='mt-2'>
                        <input
                          type="text"
                          placeholder="Introduzca el CIF"
                         {...register('cif')}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                         text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                         placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                         focus:outline-indigo-600 sm:text-sm/6"
                         />
                         
                    </div> 
            </div>
            
            

            
          <div className='mt-4'>
            <button type="submit" className=' justify-center rounded-md
             bg-indigo-600 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
             hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
             focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
              Guardar</button>
  
            <button type="button" className=' ml-4 justify-center rounded-md
             bg-indigo-600 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
             hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
             focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={handleDiscard}>
              Descartar</button>
          </div>
            <div className='mt-5'>
            {Message && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      {Message}
                 </div>
                )}

        {Success && (
                <div className='text-sm font-medium text-green-600 mb-2'>
                      {Success}
                 </div>
                )}
            </div>
        </form>

        </div>
        {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              Cliente creado con éxito
            </h2>
            <p className="mb-4">
              ¿Quieres vincular este cliente con algún proyecto?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLinkProject}
                className="bg-green-500 text-white px-4 py-2 rounded"
                
              >
                Sí, vincular
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                No, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddClient;
