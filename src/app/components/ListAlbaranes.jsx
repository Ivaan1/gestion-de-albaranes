"use client";

import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import AddAlbaranes from './AddAlbaranes';



const ListAlbaranes = () => {

    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [clients, setClientsId] = useState([]); 
    const [clientsname, setClientsname] = useState([]);
    const [Albaranes, setAlbaranes] = useState([]); 
    const [selectedAlbaran, setSelectedAlbaran] = useState(null); // Estado para el cliente seleccionado
    const { register, handleSubmit, formState: { errors } } = useForm();

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

    const handleSelectAlbaran = (Albaran) => {
      setSelectedProject(Albaran); // Establecer el cliente seleccionado
    };

    const onSubmit = async(data) => {
    
    };

    useEffect(() => {
        const fetchUserProject = async () => {
          try {
            const token = Cookies.get(`user_${userId}`); // Asegúrate de que el token esté almacenado con el userId
    
            const response = await axios.get(`https://bildy-rpmaya.koyeb.app/api/project`,{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

           setProjects (response.data);
           setProjects(response.data);
           console.log("Proyectos recogidos");
           
          
          } catch (error) {
    
            console.error("Error al obtener a los proyectos", error);
          }
        };
        fetchUserProject();
    }, [userId]); // Ejecutar el efecto cuando `userId` cambie
  


    return (
        <div>
        <div className='p-4'>
        <AddAlbaranes />
        </div>
        
        <div className="flex">
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
             <label  className="block text-sm/6 font-medium text-gray-900 "> Elige el pro</label>
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


            <div className="mt-4">
              <button 
                type="submit" 
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Crear Proyecto
              </button>
            </div>
          </form>
       

      
        </div>
      </div>
    );
  };

export default ListAlbaranes;
