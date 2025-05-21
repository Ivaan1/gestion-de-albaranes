'use server';

import { cookies } from "next/headers";
import axios from "axios";

const url = "http://localhost:5000/api";

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
        }else {
            console.error("Error en el inicio de sesión:", response.data);
        }
        
    }catch (error) {
        const message = error.response.data?.message || 'Error en login';
        console.error("Error en login:", message);
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
        if (response.status == 200) {   
            console.log("Registro exitoso");
            return response.data;    
        }else { 
            console.error("Error en el registro:", response.data);
        }

    }catch (error) {
        console.error("Error en el registro:", error);
    }
};

//necesita estar verificado el email para poder obtener el usuario
async function getUser(token) {
    try {
        const response = await axios.get(`${url}/auth/user`, {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return response.data;
        }else {
            console.error("Error al obtener el usuario:", response.data);
        }

    } catch (error) {
        console.error("Error al obtener el usuario:", error);
    }
}

//obtener todos los clientes
async function getClients(token) {
    try {
        const response = await axios.get(`${url}/clients`, {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const clients = response.data;
      
            if (!clients || clients.length === 0) {
              console.log("No hay clientes.");
              return [];
            }
      
            return clients;
          }else {
            console.error("Error al obtener los clientes:", response.data);
            return [];  
          }
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        
    }
}

async function addClient(token, clientData) {
    try {

        const response = await axios.post(`${url}/clients`, clientData, {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return response.data;
        }else {
            console.error("Error al agregar el cliente:", response.data);
        }

    } catch (error) {
        console.error("Error al agregar el cliente:", error);
    }
}

async function validationCode(token, code){
    try {
        const response = await axios.post(`${url}/auth/validation`, {
            code
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            if(response.data.user.validated){
                console.log("Código de verificación correcto");
                console.log(response.data);
                return response.data;
            }else{
                console.error("Código de verificación incorrecto");
                return response.data;
            }
        }else {
            console.error("Error en la verificación:", response.data);
        }

    } catch (error) {
        console.error("Error al verificar el código:", error);
    }
}

async function getLoggedUser(token) {
    try{
        const response = await axios.get(`${url}/users/me`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return response.data;
        }
        else {
            console.error("Error al obtener el usuario:", response.data);
        }
    }catch (error) {
        console.error("Error al obtener el usuario:", error);
    }
}


export {
    loginUser,
    registerUser,
    getUser,
    getClients,
    addClient,
    validationCode,
    getLoggedUser
}