import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Link from "next/link";
import RemoveAllCookies from "./components/RemoveAllCookies";
import React from "react";


export default function Home() {
  
  return (
   <div>
  <LoginForm />
  <RemoveAllCookies />
   </div>
  );
}
