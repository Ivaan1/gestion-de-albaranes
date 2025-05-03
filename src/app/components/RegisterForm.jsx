"use client";

import React, {useState} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';



const RegisterForm = () => {

  const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de error

  const [ Success, setSuccess ] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const router = useRouter();
  

  const saveToken = (token, userId) => {
    const cookieUserId = `user_${userId}`;  // Puedes usar un identificador único
    Cookies.set(cookieUserId, token, {expires: 2});  // Expira en 2 días
    console.log('Token guardado en cookies');
    
  };

  const onSubmit = async (data) => {
    try {

      const response = await axios.post('https://bildy-rpmaya.koyeb.app/api/user/register', {
        email: data.email,
        password: data.password
      });


      const token = response.data.token; // Obtén el token del servidor
    

      const userId = response.data.user._id;
      const email = response.data.user.email;

      console.log('id :', userId);
      console.log('email :', email);

      saveToken(token, userId);
      router.push(`/VerificarEmail?userId=${userId}`)


    } catch (error) {
        if (error.response) {
            // Si el error es por el usuario ya existe (409)
            if (error.response.status === 409) {
              setErrorMessage('El usuario ya existe con este correo. Por favor, usa otro.');
            } 
            else if (error.response.status === 422) {
              setErrorMessage('La contraseña no cumple con los requisitos.');
            }else if (error.response.status === 500){
              setErrorMessage('Hay problemas con tu conexion. Vuelve a intentarlo mas tarde');
            }
          } else {
            console.error("Error al registrarse:", error);
          }
    }
  };

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
     

        <div className ="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className ="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Crea un nuevo usuario</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            
        <form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      {errorMessage}
                 </div>
                )}

        {Success && (
                <div className='text-sm font-medium text-red-600 mb-2'>
                      Cuenta creada con exito !
                 </div>
                )}

          <div >
             <label  className="block text-sm/6 font-medium text-gray-900 ">Correo electronico</label>
                  <div className='mt-2'>
                          <input
                          type="email"
                          placeholder="Email"
                           {...register('email', { required: true })}
                           required className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                           onChange={() => setErrorMessage('')} // Limpia el error cuando cambia el correo
                         />
                         
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
                         required className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                         text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                         placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                         focus:outline-indigo-600 sm:text-sm/6"
                         />
                         
                    </div> 
            </div>
            </div>
            

            
          <div className='mt-4'>
            <button type="submit" className='flex w-full justify-center rounded-md
             bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
             hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
             focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
              Registrate</button>
          </div>
        <div>
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Ya tienes una cuenta?

            <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-500"> Inicia Sesión</Link>
             </p>
         </div>
        </form>

        </div>
    </div>
  );
};

export default RegisterForm;
