"use client";

import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import AddProjects from './AddProjects';



const ListProjects = () => {

    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [clients, setClients] = useState([]); 
    const [projects, setProjects] = useState([]); 
    const [selectedProject, setSelectedProject] = useState(null); // Estado para el cliente seleccionado
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleSelectProject = (project) => {
      setSelectedProject(project); // Establecer el cliente seleccionado
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
        <AddProjects />
        </div>
        
        <div className="flex">
        
       

        {/* Listado de Proyectos */}
        <div className="w-1/3 p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Listado de proyectos</h2>
          <ul>
          {projects.map((project) => (
            <li
              key={project._id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectProject(project)}
            >
              <div className="flex items-center">
              
                <span>{project.name}</span>
              </div>
            </li>
          ))}
        </ul>
        </div>
        {/* Detalles del Cliente Seleccionado */}
        <div className="w-2/3 p-4">
          {selectedProject ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className='text-xl font-bold text-gray-900'>{selectedProject.name}</h1>
              <h2 className=" font-bold mb-2 text-gray-500">Detalles del Proyecto</h2>
              
              <p><strong>Codigo del proyecto:</strong> {selectedProject.code}</p>
              <p><strong>Calle:</strong> {selectedProject.address['street']}</p>
              <p><strong>Número:</strong> {selectedProject.address['number']}</p>
              <p><strong>Codigo postal:</strong> {selectedProject.address['postal']}</p>

 {/* Aquí puedes agregar más campos según tu estructura */}
            </form>
          ) : (
            <p>Selecciona un proyecto para ver los detalles.</p>
          )}
        </div>
  
      </div>
      </div>
    );
  };

export default ListProjects;
