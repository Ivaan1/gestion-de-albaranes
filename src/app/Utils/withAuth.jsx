// components/withAuth.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    useEffect(() => {
      // Obtén el token de las cookies
      const token = Cookies.get(`user_${userId}`);
      if (!token) {
        // Si no hay token, redirige a la página de inicio de sesión
        router.push("/");
      }
    }, [userId, router]);

    // Renderiza el componente original si el token existe
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
