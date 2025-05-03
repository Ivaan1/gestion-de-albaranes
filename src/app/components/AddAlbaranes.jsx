"use client";
import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';


const AddAlbaranes = () => {
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
            const token = Cookies.get(`user_${userId}`); // Asegúrate de que el token esté almacenado con el userId
    
            const response = await axios.get(`https://bildy-rpmaya.koyeb.app/api/client`,{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            const clientesname = response.data.map(client => client.name);
            const clientesId = response.data.map(client => client._id);

            setClientsId(clientesId);
            setClientsname(clientesname);
            //console.log(clientesId, clientesname);
          
          } catch (error) {
    
            console.error("Error al obtener a los clientes", error);
          }
        };
        fetchUserClients();
    }, [userId]); // Ejecutar el efecto cuando `userId` cambie


    const onSubmit = async (data) => {
        try {
            console.log ("Datos enviados : ", data);
            const token = Cookies.get(`user_${userId}`);
    
            const domicilio = data.address;
            const [street, number, postal, city, province] = domicilio.split(",").map(s => s.trim());
    
           const response = await axios.post('https://bildy-rpmaya.koyeb.app/api/project', {
                name: data.name,
                projectCode: data.projectcode,
                email : data.email,
                address: {
                    street,  
                    number: parseInt(number),  
                    postal: parseInt(postal), 
                    city,    
                    province 
                  },
                code: data.codigointerno,
                clientId : data.client
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          console.log(response.data);
          console.log("proyecto guardado con exito")
          setSuccess("Proyecto guardado con exito.")
    
        } catch (error) {
            setErrorMessage("Ocurrio un error. Intentelo de nuevo mas tarde.")
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
            <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">A quien le pertenece este proyecto?</label>
                  <div className='mt-2'>
                  <select name="clientId"
                   {...register('client', { required: true })}
                    className="border p-2">

                    {clientsname.map((name, index) => (
                     <option key={index} value={clientsId[index]}>
                     {name}
                    </option>
                     ))}
                    </select>
                         
                    </div>
           </div> 

           <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">Nombre del proyecto</label>
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

           <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">Correo electronico</label>
                  <div className='mt-2'>
                          <input
                          type="email"
                          placeholder="Introduce el correo electronico"
                           {...register('email', { required: true })}
                           required className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')} // Limpia el error cuando cambia el correo
                         />
                         
                    </div>
           </div>

           <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">Direccion</label>
             <p className=' italic block text-sm font-medium text-gray-900'> ej "calle de las Rosas, 23, 28025 Madrid"</p>
                 
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce la direccion"
                           {...register('address', { required: true })}
                           required className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')} // Limpia el error cuando cambia el correo
                         />
                         
                    </div>
           </div>
           <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">Codigo interno</label>
             
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el codigo interno"
                           {...register('codigointerno', { required: true })}
                           required className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')} // Limpia el error cuando cambia el correo
                         />
                         
                    </div>
           </div>

           <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">Codigo identificador</label>
             
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Introduce el codigo del proyecto"
                           {...register('projectcode', { required: true })}
                           required className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')} // Limpia el error cuando cambia el correo
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
                <div className='text-sm font-medium text-red-600 mb-2'>
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
export default AddAlbaranes;
