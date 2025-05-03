'use client';

import React,{ useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';



const EmailVerification = () => {

  const router = useRouter();

  const searchParams = useSearchParams();

  const userId = searchParams.get('userId');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [verificationCode, setVerificacionCode] = useState('');

  const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de error

  const[Success, setSuccess] = useState(false);


  const onSubmit = async(data) => {
    console.log("Datos enviados: ", data);
    console.log("userid : " , userId);
    try {

      const token = Cookies.get(`user_${userId}`); // Asegúrate de que el token esté almacenado con el userId
      console.log('Cookie value:', token);

      const response = await axios.put('https://bildy-rpmaya.koyeb.app/api/user/validation', {
        code: data.codigo,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Código aceptado: ", response.codigo);
      setSuccess(true);

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('El código es incorrecto. Vuelva a intentarlo');
          console.log("Unauthorized. Authentication token is missing or invalid.");
        } else {
          setErrorMessage("Error. Vuelva a intentarlo más tarde.");
        }
      } 
    }
  };

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>

        <div className ="sm:mx-auto sm:w-full sm:max-w-sm">
            <h3 className ="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Verifica tu correo electronico</h3>
            <p className='mt-1 text-sm text-center font-semibold tracking-tight text-gray-900'>Te hemos enviado un codigo a tu correo electronico</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            
           <div >
             <label  className="block text-sm/6 font-medium text-gray-900">Introduce el codigo de verificación</label>
                  <div className='mt-2'>
                          <input
                          type="text"
                          placeholder="Codigo de verificación"
                           {...register('codigo', { required: true })}
                           required 
                           className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')}
                         />
                         
                    </div>
           </div> 
           <div>{errorMessage && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      {errorMessage}
                 </div>
                )}
                </div>

         <div className='mt-3'>
          <button type="submit" className='flex w-full justify-center rounded-md
         bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
         hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
         focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
         >Confirmar correo electronico</button>
         </div>
         {Success && (
                <div>
                  <p className='mt-5 text-sm  font-bold tracking-tight text-red-600'>Codigo válido --
                  <Link href="/" className="font-semibold underline text-indigo-600 hover:text-indigo-500">Inicia sesion</Link>
                  </p>
               </div>
                )}
      
        </div>
    </form>
    </div>
  );
};

export default EmailVerification;
