'use server';

import { cookies } from "next/headers";
import axios from "axios";

const url = "http://192.168.1.16:5000/api";

async function loginUser({ email, password }) {
    try{
        const response = await axios.post(`${url}/auth/login`, {
            email,
            password
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200 && response.data.token) {
            console.log("Inicio de sesión exitoso");
            const token = response.data.token;
            return token;
        }
        
        throw new Error("Usuario o contraseña no válidos.");
    }catch (error) {
        if (error.response) {
            const message = error.response.data?.message || 'Error en login';
            throw new Error(message);

          } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor');
          } else {
            throw new Error('Error desconocido al iniciar sesión');
          }
    }
}

async function registerUser(userData) {
    
    try {
        const response = await axios.post(`${url}/auth/register`,
            {
                email: userData.email,
                password: userData.password
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });

        console.log("Registro exitoso");
        const token = response.data.token;
        return token;

    }catch (error) {
        if (error.response) {
            console.log('Error Status:', error.response.status); // Muestra el código de estado HTTP
            console.log('Error Data:', error.response.data); // Muestra los datos del error, que deberían contener el mensaje

            // Mejorar el manejo de errores para capturar diferentes estructuras
            let errorMessage = 'Error en el registro';
            
           // Verificar si hay errores de validación
           if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
            // Manejar errores de validación (como el que mostraste antes)
            const validationErrors = error.response.data.errors
                .map(err => `${err.path}: ${err.msg}`)
                .join(', ');
            errorMessage = `Errores de validación: ${validationErrors}`;
            } 
            // Si hay un mensaje directo
            else if (error.response.data?.message) {
                errorMessage = error.response.data.message;
            } 
            // Si el error es una cadena directa
            else if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            }
        
        throw new Error(errorMessage);
          } else if (error.request) {
            console.log('Error Request:', error.request); // Ver la solicitud que se intentó
            throw new Error('No se pudo conectar con el servidor');

          } else {
            console.log('Error desconocido:', error.message); // Log del error general
            throw new Error('Error desconocido al iniciar sesión');
          }
    }
};

//necesita estar verificado el email para poder obtener el usuario
async function getUser(token) {
    try {
        const response = await axios.get(`${url}/auth/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
    }
}


export {
    loginUser,
    registerUser,
    getUser
}