"use client";

import ListProjects from "@/app/components/ListProjects";
import React from "react";
import withAuth from "@/app/Utils/withAuth";

const proyectos = () => {

  return (
    <ListProjects />
  );
}
export default withAuth(proyectos);
