"use client";

import ListAlbaranes from "@/components/page/albaranes/ListAlbaranes";
import withAuth from "@/app/Utils/withAuth";
import React from "react";

const Albaranes = () => {


    return(

        <div>
                <ListAlbaranes />
                
        </div>

    );


}
export default withAuth(Albaranes);
