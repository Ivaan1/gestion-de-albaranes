// src/app/error/not-found.js
import Link
 from "next/link";
const Custom404 = () => {
    return (
      <div>
        <h2 className ="mt-20 text-center text-2xl/9 font-bold 
        tracking-tight text-gray-900">ERROR 404</h2>
        <p className="mt-10 text-center text-xl font-bold 
        tracking-tight text-gray-900">Lo sentimos, no encontramos el recurso que buscas.</p>
        <div className="mt-10 text-center text-xl font-bold 
        tracking-tight text-blue-300">
        <Link href="/" > Volver al Inicio</Link>
        </div>
      </div>
      
    );
  };
  export default Custom404;
  