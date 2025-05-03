"use client";

import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';



const ListClients = () => {

    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [clients, setClients] = useState([]); // Estado para los clientes
    const [projects, setProjects] = useState([]); // Estado para los clientes
    const [selectedClient, setSelectedClient] = useState(null); // Estado para el cliente seleccionado
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
    
    };


    const handleSelectClient = (client) => {
        setSelectedClient(client); // Establecer el cliente seleccionado
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
           setClients (response.data);
           console.log("Clientes recogidos");
           console.log(response.data);
          
          } catch (error) {
    
            console.error("Error al obtener a los clientes", error);
          }
        };
        fetchUserClients();
    }, [userId]); // Ejecutar el efecto cuando `userId` cambie

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
           console.log("Proyectos recogidos");
           console.log(response.data);
          
          } catch (error) {
    
            console.error("Error al obtener a los proyectos", error);
          }
        };
        fetchUserProject();
    }, [userId]); // Ejecutar el efecto cuando `userId` cambie
  


    return (
        <div className="flex">
        {/* Listado de Clientes */}
        <div className="w-1/3 p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Listado de Clientes</h2>
          <ul>
          {clients.map((client) => (
            <li
              key={client._id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectClient(client)}
            >
              <div className="flex items-center">
           
                <span>{client.name}</span>
              </div>
            </li>
          ))}
        </ul>
        </div>
  
        {/* Detalles del Cliente Seleccionado */}
        <div className="w-2/3 p-4">
          {selectedClient ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className='text-xl font-bold text-gray-900'>{selectedClient.name}</h1>
              <h2 className=" font-bold mb-2 text-gray-500">Detalles del Cliente</h2>
              
              <p><strong>CIF:</strong> {selectedClient.cif}</p>
              <p><strong>Calle:</strong> {selectedClient.address['street']}</p>
              <p><strong>Número:</strong> {selectedClient.address['number']}</p>
              <p><strong>Codigo postal:</strong> {selectedClient.address['postal']}</p>
              <p><strong>Proyectos:</strong> {selectedClient.activeProjects}</p>

 {/* Aquí puedes agregar más campos según tu estructura */}
            </form>
          ) : (
            <p>Selecciona un cliente para ver los detalles.</p>
          )}
        </div>
      </div>
    );
  };

export default ListClients;
