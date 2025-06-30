"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from "js-cookie";
import axios from "axios";
import { getLoggedUser } from "@/app/utils/api";

function Header() {
    const [userEmail, setUserEmail] = useState("");
 
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const token = localStorage.getItem("jwt") || Cookies.get("jwt");
            const response = await getLoggedUser(token);
            if (!token) {
                console.error("Token no encontrado.");
                return;
            }
        if (response) {
        setUserEmail(response.data.email);
        }
        } catch (err) {
            console.error("Error al obtener el usuario:", err);
        }  
    };

  fetchUser();
}, []);



  return (
    <header className="flex flex-row items-center justify-between sm:justify-around p-2 border-b-2 bg-blue-100">
      
      <nav className="hidden sm:flex justify-between items-center gap-6 font-semibold">
      <Link href={`/PaginaGestion`} className="hover:text-gray-500">
         Home
        </Link>
        <Link href={`/PaginaGestion/CrearCliente`} className="hover:text-gray-500">
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