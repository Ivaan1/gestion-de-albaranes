'use client';

import {React,  useState } from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginForm = () => {

  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  

  const saveToken = (token, userId) => {
      const cookieUserId = `user_${userId}`;  // Puedes usar un identificador único
      Cookies.set(cookieUserId, token, {expires: 2});  // Expira en 2 días
      console.log('Token guardado en cookies');
      
    };


  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://bildy-rpmaya.koyeb.app/api/user/login', {
        email: data.email,
        password: data.password
      });
      const userId = response.data.user._id;
      const token = response.data.token;
      console.log("Inicio de sesion correctamente"); // Maneja la respuesta (ej. token, datos del usuario)
      saveToken(token,userId);
      console.log(data);
      router.push(`/PaginaGestion?userId=${userId}`);

      
    } catch (error) {
      setErrorMessage("Los parametros no coinciden vuelve a intentarlo")
      console.log(data);
    }

  };

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
     

        <div className ="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className ="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Iniciar Sesion</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            
        <form onSubmit={handleSubmit(onSubmit)}>

          <div >
             <label  className="block text-sm/6 font-medium text-gray-900">Correo electronico</label>
                  <div className='mt-2'>
                          <input
                          type="email"
                          placeholder="Email"
                           {...register('email', { required: true })}
                           required 
                           className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                         />
                         {errors.email && <span>Email es requerido</span>}
                    </div>
           </div>  
      
           <div className='mt-2'>
            <div> 
                <div>
                 <label  className="block text-sm/6 font-medium text-gray-900">Contraseña</label>
                 </div>
                     <div className='mt-2'>
                        <input
                          type="password"
                          placeholder="Contraseña"
                         {...register('password', { required: true })}
                         required 
                         className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                         text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                         placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                         focus:outline-indigo-600 sm:text-sm/6"
                         />
                    </div>
                    
            </div>

                    <div className="text-sm mt-1">
                         <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Olvide mi contraseña?</Link>
                         {errors.password && <span>Contraseña es requerida</span>}
                     </div>
            </div>

            
          <div className='mt-4'>
            <button type="submit" className='flex w-full justify-center rounded-md 
            bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>Iniciar sesión</button>
          </div>
          <div>
      {errorMessage && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      {errorMessage}
                 </div>
                )}
            </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
            No tienes una cuenta?

            <Link href="/auth/Register" className="font-semibold text-indigo-600 hover:text-indigo-500"> Registrate</Link>
         </p>

        </div>
    </div>
  );
};

export default LoginForm;
