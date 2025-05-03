"use client";

import React, {useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const DeleteAccount = () => {
  const router = useRouter(); // Para redirigir después de borrar la cuenta
  const [Message, setMessage] = useState('');

    const searchParams = useSearchParams();  
    const userId = searchParams.get('userId');
  
  
  // Marca la función como asincrónica
  const handleDelete = async () => {
    try {
        
       const token = Cookies.get(`user_${userId}`);
      console.log(token);

      // Realizamos el DELETE
      const response = await axios.delete(`https://bildy-rpmaya.koyeb.app/api/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Si la solicitud es exitosa, eliminamos la cookie y redirigimos
      Cookies.remove('userId');
      Cookies.remove(`user_${userId}`);

      setMessage('Cuenta eliminada exitosamente');
      router.push('/login'); // Redirige al login después de borrar la cuenta
    } catch (error) {
     
      setMessage("Hubo un problema al intentar eliminar la cuenta.");
    }
  };

  return (
    <div className="text-left">
      <h2 className="text-xl font-bold">Eliminar Cuenta</h2>
      <div>
      {Message && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      {Message}
                 </div>
                )}
            </div>
      <button 
        onClick={handleDelete} 
        className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-700"
      >
        Eliminar mi cuenta
      </button>
    </div>
  );
};

export default DeleteAccount;
