'use client';

import React,{ useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const EmailVerification = () => {

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState(null);
  const inputRefs = useRef([]);
  const router = useRouter();


  const handleChange = (value, index) => {
    const newValue = value.replace(/\D/g, "").slice(0, 1);
    const updatedCode = [...code];
    updatedCode[index] = newValue;
    setCode(updatedCode);

    if (newValue && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = parseInt(code.join(""), 10);
    try {

        const url = "http://192.168.1.16:5000/api";
        const token = localStorage.getItem("token") || Cookies.get("jwt");
      if (!token) {
        setMessage("Token no encontrado. Por favor, vuelve a iniciar sesión.");
        return;
      }

      console.log("verificacionCode", verificationCode);

      const res = await fetch(`${url}/auth/validation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error en la validación");
        return;
      }

      if (data.validated) {
        setMessage("Usuario validado correctamente.");
        // Update the user cookie with validation status

        // Redirect to home or dashboard after successful validation
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setMessage(`Código incorrecto. Intentos restantes: ${data.tries}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
    }
  };



  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>

        <div className ="sm:mx-auto sm:w-full sm:max-w-sm">
            <h3 className ="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Verifica tu correo electronico</h3>
            <p className='mt-1 text-sm text-center font-semibold tracking-tight text-gray-900'>Te hemos enviado un codigo a tu correo. </p>
        </div>

        <form onSubmit={handleSubmit}>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            
           <div >
             <label  className="block text-sm/6 font-medium text-gray-900">Introduce el codigo de verificación</label>
             <div className="flex space-x-2 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-12 h-12 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring focus:ring-black"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

           </div> 
           {message && <div className={`text-center mb-4 text-sm ${message.includes("correctamente") ? "text-green-600" : "text-red-600"}`}>{message}</div>}


         <div className='mt-3'>
          <button type="submit" className='flex w-full justify-center rounded-md
         bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
         hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
         focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
         >Confirmar correo electronico</button>
         </div>


        </div>
    </form>
    </div>
  );
};

export default EmailVerification;
