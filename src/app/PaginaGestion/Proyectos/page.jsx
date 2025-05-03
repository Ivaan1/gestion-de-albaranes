"use client";

import ListProjects from "@/components/page/projects/ListProjects";
import React from "react";
import withAuth from "@/app/Utils/withAuth";

const proyectos = () => {

  return (
    <ListProjects />
  );
}
export default withAuth(proyectos);
