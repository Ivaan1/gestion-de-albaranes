"use client";

import DeleteAccount from "@/components/DeleteAccount";
import React from "react";
import withAuth from "@/app/Utils/withAuth";

const Settings = () => {

  return (
    <DeleteAccount />
  );
}
export default withAuth(Settings);
