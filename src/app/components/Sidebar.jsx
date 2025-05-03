"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';

const Sidebar = () => {

    const searchParams = useSearchParams();  
    const userId = searchParams.get('userId');

    
    

  return (
    
  <div
  className="relative flex h-[calc(155vh-23rem)] w-full max-w-[13rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
  
  <div className="p-4 mb-2">
    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
      Menu
    </h5>
  </div>

  <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
    
    <div 
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg 
      outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 
      hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 
      focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
      <Link href = {`/PaginaGestion/Clientes?userId=${userId}`}>
      Clientes
      </Link>
    </div>
    <div
      className="flex items-center w-full p-3 leading-tight transition-all 
      rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 
      hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 
      active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
    <Link href = {`/PaginaGestion/Proyectos?userId=${userId}`}>
      Proyectos
      </Link>
    </div>

    <div 
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg 
      outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 
      focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 
      active:bg-opacity-80 active:text-blue-gray-900">
      <Link href = {`/PaginaGestion/Albaranes?userId=${userId}`}>
      Albaranes
      </Link>
    </div>
    
    <div role="button"
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">

<Link href = {`/PaginaGestion/Profile?userId=${userId}`}>
      Profile
      </Link>
    </div>
    <div role="button"
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">

<Link href = {`/PaginaGestion/Settings?userId=${userId}`}>
      Settings
      </Link>
    </div>


    <div 
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
      <Link
        href="/">
      Cerrar Sesión
      </Link>
    </div>
  </nav>
</div>
  
  );
};

export default Sidebar;
