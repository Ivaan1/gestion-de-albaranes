"use client";

import AddClient from "@/components/page/clients/AddClient";
import React from "react";
import withAuth from "@/app/Utils/withAuth";

const CrearCliente = () => {

  return (
    <div>   
      <AddClient />
   </div>
  );
}
export default withAuth(CrearCliente);
