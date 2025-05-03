import LoginForm from "../components/page/auth/LoginForm";
import RegisterForm from "../components/page/auth/RegisterForm";
import Link from "next/link";
import RemoveAllCookies from "../components/RemoveAllCookies";
import React from "react";


export default function Home() {
  
  return (
   <div>
  <LoginForm />
  <RemoveAllCookies />
   </div>
  );
}
