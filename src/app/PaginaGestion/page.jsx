"use client";

import Header from "@/components/menu/Header";
import Sidebar from "@/components/menu/Sidebar";
import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from "../Utils/withAuth";


const PaginaGestion = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [clients, setClients] = useState([]); // Estado para los clientes
  const [mensaje, setMessage ] = useState('');
  const token = Cookies.get(`user_${userId}`); // Asegúrate de que el token esté almacenado con el userId
  
 
  useEffect(() => {
  
    const fetchUserClients = async () => {
      try {
        const token = Cookies.get(`user_${userId}`); // Asegúrate de que el token esté almacenado con el userId
  
        const response = await axios.get(`https://bildy-rpmaya.koyeb.app/api/client`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      
        const fetchedClients = response.data;
        if (fetchedClients.length === 0) {
          setMessage("No tienes clientes aún, empieza por crear uno.");
         
        }
  
      } catch (error) {
      }
    };
    fetchUserClients();
  }, [userId]); // Ejecutar el efecto cuando `userId` cambie
  
  
  return (
    <div className="text-center">   
      
      <div className="mt-5">
      <h2 className=' mb-9 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>Bienvenido</h2>
        {mensaje && <p className="text-xl font-bold">{mensaje}</p>}
      </div>
      <Link href= {`/PaginaGestion/CrearCliente?userId=${userId}`} className="font-semibold text-indigo-600 hover:text-indigo-500">Crea un cliente ahora 
      </Link>
   </div>
  );
}
export default withAuth(PaginaGestion);
