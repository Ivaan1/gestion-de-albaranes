"use client";

import React, {useState} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';



const AddClient = () => {

  const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de error

  const [ Success, setSuccess ] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const router = useRouter();
  const [showModal, setShowModal] = useState(false); // Controla el modal

  const searchParams = useSearchParams();  
  const userId = searchParams.get('userId');


  const handleDiscard = () => {
    console.log("Cambios descartados");
    document.getElementById("myForm").reset(); // Restablece el formulario
    console.log("Formulario descartado");
    setSuccess("");
  };
  

   const onSubmit = async (data) => {
    try {
        console.log ("Datos enviados : ", data);
        const token = Cookies.get(`user_${userId}`);

        const domicilio = data.Domicilio;
        const [street, number, postal, city, province] = domicilio.split(",").map(s => s.trim());

       const response = await axios.post('https://bildy-rpmaya.koyeb.app/api/client', {
        name: data.name,
        cif: data.CIF,
        address: {
            street,  
            number: parseInt(number),  
            postal: parseInt(postal), 
            city,    
            province 
          }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Cliente guardado con exito")
      setSuccess("Cliente guardado con exito.")
      setShowModal(true); // Muestra el modal después de crear el cliente

    } catch (error) {
        setErrorMessage("Ocurrio un error. Intentelo de nuevo mas tarde.")
    }
  };

  const handleLinkProject = () => {
    console.log("Vinculando cliente con un proyecto...");
    router.push(`/PaginaGestion/Proyectos?userId=${userId}`);
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
            
        <form onSubmit={handleSubmit(onSubmit)} id="myForm">
        
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
                           onChange={() => setErrorMessage('')} // Limpia el error cuando cambia el correo
                         />
                         
                    </div>
           </div>  
      
           <div className='mt-2'>
                
                 <label  className="block text-sm/6 font-medium text-gray-900">Domicilio Fiscal</label>
                 <p className=' italic block text-sm font-medium text-gray-900'>ej "calle de las Rosas, 23, 28025 Madrid"</p>
                 
                     <div className='mt-2'>
                        <input
                          type="textarea"
                          placeholder="Introduzca el domicilio"
                         {...register('Domicilio')}
                         required className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                         text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                         placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                         focus:outline-indigo-600 sm:text-sm/6"
                         />
                         
                    </div> 
            </div>
            <div className='mt-2'>
                
                 <label  className="block text-sm/6 font-medium text-gray-900">CIF</label>
                 
                     <div className='mt-2'>
                        <input
                          type="text"
                          placeholder="Introduzca el CIF"
                         {...register('CIF')}
                         required className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                         text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                         placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                         focus:outline-indigo-600 sm:text-sm/6"
                         onChange={() => setErrorMessage('')}
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
            {errorMessage && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      {errorMessage}
                 </div>
                )}

        {Success && (
                <div className='text-sm font-medium text-red-600 mb-2'>
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
