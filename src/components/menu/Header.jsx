"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from "js-cookie";
import axios from "axios";

function Header() {
  const searchParams = useSearchParams();  
  const userId = searchParams.get('userId');

  const [userEmail, setUserEmail] = useState("");
 


  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = Cookies.get(`user_${userId}`); // Asegúrate de que el token esté almacenado con el userId

        const response = await axios.get(`https://bildy-rpmaya.koyeb.app/api/user`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const email = response.data.email;
        setUserEmail(email.split("@")[0]); // Solo la parte antes del "@"

      } catch (error) {

        console.log("Error al obtener el email del usuario:", error);
      }
    }
    fetchUserEmail();
    
  }, [userId]); // Ejecutar el efecto cuando `userId` cambie


  return (
    <header className="flex flex-row items-center justify-between sm:justify-around p-2 border-b-2 bg-blue-100">
      
      <nav className="hidden sm:flex justify-between items-center gap-6 font-semibold">
      <Link href={`/PaginaGestion?userId=${userId}`} className="hover:text-gray-500">
         Home
        </Link>
        <Link href={`/PaginaGestion/CrearCliente?userId=${userId}`} className="hover:text-gray-500">
          Crear Cliente
        </Link>
        <p>
            Bienvenido {userEmail ? userEmail : "Cargando..."}
        </p>

      </nav>

    </header>
  );
}

export default Header;