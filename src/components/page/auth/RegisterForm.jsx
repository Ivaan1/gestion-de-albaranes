"use client";

import React, {useState} from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { getUser, registerUser} from '@/app/utils/api';
import Loading from '@/components/menu/loading';



const RegisterForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Validación manual de contraseña
    const password = formData.password;

    if (!password || password.length < 8 || password.length > 16) {
        setErrorMessage("La contraseña debe tener entre 8 y 16 caracteres.");
        setIsLoading(false);
        return;
    }


    try {
        const result = await registerUser(formData);
        
        if (!result || !result.token) {
          setErrorMessage("Error en el registro");
          return;
        }

        const token = result.token;

        //guardamos el token en las cookies 
        Cookies.set("jwt", token, {
            expires: 180,
            path: "/",
            secure: true,
            sameSite: "strict"
          });


        //guardamos el token en el localStorage
        localStorage.setItem("token", token);

        localStorage.setItem('user', JSON.stringify(result.user));


        router.push("/auth/VerificarEmail");

    }catch (error) {
        console.error("Registration error:", error);
        setErrorMessage("El registro ha fallado. Intenta nuevamente.");
    }finally {
        setIsLoading(false);
    }
  }



  return (
    <>

    <main className="flex items-center justify-center h-screen">

    {!isLoading && <div className="w-full max-w-md p-8">

        {/* CAMPO Register */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">


			{/* Titulo */}
			<div className ="sm:mx-auto sm:w-full sm:max-w-sm">
            	<h2 className ="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Crea tu cuenta</h2>
        	</div>
		
        	<form onSubmit={handleSubmit}>

				{/* campo correo */}
          		<div >  
             		<label  className="block text-sm/6 font-medium text-gray-900">Correo electronico</label>
                  		<div className='mt-2'>
                          	<input
                          	type="email"
                          	placeholder="Email"
                          	id="email"
                          	name="email"
                          	onChange={handleChange}
                           	className='block w-full rounded-md bg-white px-3 py-1.5 text-base 
                           text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                           placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                           focus:outline-indigo-600 sm:text-sm/6'
                         	/>
                    	</div>
           		</div>  
      
           		{/* campo contraseña */}
            	<div className='mt-2'> 
                	<div>
                 		<label  className="block text-sm/6 font-medium text-gray-900">Contraseña</label>
                 	</div>
                    <div className='mt-2'>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
                        	 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                        	 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 
                       	  focus:outline-indigo-600 sm:text-sm/6"
                      	   />
                   	</div>
                    
            	</div>

            
				{/* boton registrarse */}
          		<div className='mt-4'> 
            		<button type="submit" className='flex w-full justify-center rounded-md 
           			 bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
           			 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
            			focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>Registrarse</button>
          		</div>
				
				{/* mensaje de error */}
          		<div className='mt-4'> 
       				 {errorMessage && (
                	<div className='text-sm font-medium text-red-600 mb-2'>
                      {errorMessage}
                 	</div>
                	)}
            	</div>

        	</form>

        	<p className="mt-10 text-center text-sm/6 text-gray-500">
            	Ya tienes cuenta?
				<Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-500"> Inicia Sesión!</Link>
         	</p>

		</div>


    </div>} 

    </main>  
        {isLoading && (
                <div className="fixed top-0 left-0 w-screen h-screen z-50">
                    <Loading />
                </div>
            )}

</>
  );
};

export default RegisterForm;
