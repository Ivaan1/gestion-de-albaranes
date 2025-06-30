"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Cookies from "js-cookie";
import axios from "axios";
import { getLoggedUser } from "@/app/utils/api";
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Plus,
  Home,
  Users,
  Moon,
  Sun,
  Menu
} from 'lucide-react';

function Header() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Simulación de notificaciones
  const [notifications] = useState([
    { id: 1, message: "Nuevo cliente registrado", time: "Hace 5 min", unread: true },
    { id: 2, message: "Proyecto actualizado", time: "Hace 1 hora", unread: true },
    { id: 3, message: "Albarán generado", time: "Hace 2 horas", unread: false }
  ]);

  const unreadNotifications = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("jwt") || Cookies.get("jwt");
        
        if (!token) {
          console.error("Token no encontrado.");
          setIsLoading(false);
          return;
        }

        const response = await getLoggedUser(token);
        
        if (response) {
          setUserEmail(response.data.email);
          // Extraer nombre del email o usar nombre completo si está disponible
          const name = response.data.name || response.data.email.split('@')[0];
          setUserName(name);
        }
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    Cookies.remove("jwt");
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/PaginaGestion/buscar?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickActions = [
    { name: 'Crear Cliente', href: '/PaginaGestion/CrearCliente', icon: Users, color: 'text-green-600' },
    { name: 'Nuevo Proyecto', href: '/PaginaGestion/Proyectos', icon: Plus, color: 'text-blue-600' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center space-x-6">

          {/* Quick Actions - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors group"
                >
                  <Icon className={`w-4 h-4 ${action.color} group-hover:scale-110 transition-transform`} />
                  <span>{action.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-3">
          
          

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {isLoading ? "Cargando..." : (userName || "Usuario")}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-32">
                  {isLoading ? "" : userEmail}
                </p>
              </div>
              
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{userName || "Usuario"}</p>
                  <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                </div>

                {/* Menu Items */}
                <Link
                  href="/PaginaGestion/Profile"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Mi Perfil</span>
                </Link>

                <Link
                  href="/PaginaGestion/Settings"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Configuración</span>
                </Link>

                <hr className="my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </form>
      </div>
    </header>
  );
}

export default Header;