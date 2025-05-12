'use client';

import {React,  useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/utils/api';
import Loading from '@/components/menu/loading';

const LoginForm = () => {

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


  	try {

		if (!formData.email || !formData.password) {
			setErrorMessage("Por favor ingresa tu correo y contraseña.");
			setIsLoading(false);
			return; // Detener el flujo si falta un campo
		  }
		  
    	const token = await loginUser(formData); 

    	if (token) {
      		Cookies.set('jwt', token);
      		router.push('/PaginaGestion');
    	}else{
      		setErrorMessage("Usuario o contraseña no válidos");
    	}	
  	}catch (error){
      console.error('Error al intentar iniciar sesión:', error);
      setErrorMessage("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
  	}finally{
      	if (!token) {
      	setIsLoading(false);  //volvemos al formulario si no hay login exitoso
      	}
  	}
};



  return (
    <>

    <main className="flex items-center justify-center h-screen">

    {!isLoading && <div className="w-full max-w-md p-8">

        {/* CAMPO DE INICIAR SESION */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">


			{/* Titulo */}
			<div className ="sm:mx-auto sm:w-full sm:max-w-sm">
            	<h2 className ="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Iniciar Sesion</h2>
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

				{/* campo recordar contraseña */}
                <div className="text-sm mt-1"> 
                         <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Olvide mi contraseña?</Link>
                </div>
            
				{/* boton iniciar sesion */}
          		<div className='mt-4'> 
            		<button type="submit" className='flex w-full justify-center rounded-md 
           			 bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
           			 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
            			focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>Iniciar sesión</button>
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
            	No tienes una cuenta?
				<Link href="/auth/Register" className="font-semibold text-indigo-600 hover:text-indigo-500"> Registrate</Link>
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


export default LoginForm;
