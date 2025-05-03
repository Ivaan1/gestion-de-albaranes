"use client";

import React from 'react';
import Cookies from 'js-cookie';

const RemoveAllCookies = () => {

  const removecookies = () => {
    const cookies = Cookies.get(); // Obtén todas las cookies
    for (let cookieName in cookies) {
      Cookies.remove(cookieName);
    }
    console.log("Todas las cookies han sido eliminadas");
  };

  return (
    <button onClick={removecookies} className="bg-red-500 text-white p-2 rounded ml-5 mt-20">
      Borrar Cookies
    </button>
  );
};

export default RemoveAllCookies;
