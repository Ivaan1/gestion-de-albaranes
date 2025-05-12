"use client";

import Header from "@/components/menu/Header";
import Sidebar from "@/components/menu/Sidebar";
import React, {useState, useEffect} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { getClients } from "@/app/utils/api";


const PaginaGestion = () => {

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = Cookies.get("jwt") || localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      //obtenemos los clientes 
      const data = await getClients(token);

      if (data) {
        setClientes(data);
      }
      setLoading(false);
    };

    fetchClientes();
  }, []);

  
  return (
    <>
    <main>
        <h2 className=' mb-9 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>Bienvenido</h2>
      
        {clientes.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/021/249/018/small/confused-man-thinking-of-problem-solution-png.png"
            alt="Sin clientes"
            style={{ width: "150px", marginBottom: "1rem" }}
          />
          <p>Aún no tienes ningún cliente.</p>
          <Link href="/PaginaGestion/CrearCliente">Crear un cliente ahora</Link>
        </div>
      ) : (
        <div>
        <button>
          <Link href="/PaginaGestion/CrearCliente">Agregar cliente</Link>
        </button>
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente._id}>
              <p>{cliente.name}</p>
                <Link href="/PaginaGestion/Clientes">Ver Detalles </Link> 
                <Link href="/PaginaGestion/Clientes">Editar</Link>
            </li>
          ))}
        </ul>
      </div>
    )}
    </main>
   </>
  );
}
export default PaginaGestion;
