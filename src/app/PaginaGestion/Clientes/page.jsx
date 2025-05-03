"use client";

import ListClients from "@/app/components/ListClients";
import withAuth from "@/app/Utils/withAuth";
import React from "react";

const Clientes = () => {


    return(

        <div>
                <ListClients />
                
        </div>

    );


}
export default withAuth(Clientes);
