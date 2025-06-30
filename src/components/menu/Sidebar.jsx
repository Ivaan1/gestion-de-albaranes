"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  Users, 
  FolderOpen, 
  FileText, 
  User, 
  LogOut, 
  Menu,
  X,
  ChevronLeft,
  Home,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const searchParams = useSearchParams();  
  const userId = searchParams.get('userId');
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: 'Inicio',
      href: '/PaginaGestion',
      icon: Home,
      color: 'text-blue-600'
    },
    {
      name: 'Clientes',
      href: '/PaginaGestion/Clientes',
      icon: Users,
      color: 'text-green-600'
    },
    {
      name: 'Proyectos',
      href: '/PaginaGestion/Proyectos',
      icon: FolderOpen,
      color: 'text-purple-600'
    },
    {
      name: 'Albaranes',
      href: '/PaginaGestion/Albaranes',
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      name: 'Profile',
      href: '/PaginaGestion/Profile',
      icon: User,
      color: 'text-indigo-600'
    }
  ];

  const isActiveRoute = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    // Aquí puedes agregar lógica de logout adicional
    router.push('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GM</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Gestión</h1>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            {/* Desktop Collapse Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isCollapsed ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  hover:bg-gray-50 group relative
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`
                  w-5 h-5 flex-shrink-0 transition-colors
                  ${isActive ? 'text-blue-600' : item.color}
                `} />
                
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
                
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section & Logout */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {/* Settings */}
          <Link
            href="/PaginaGestion/Settings"
            onClick={() => setIsMobileOpen(false)}
            className={`
              flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
              text-gray-600 hover:text-gray-900 hover:bg-gray-50
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Configuración</span>}
            
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Configuración
              </div>
            )}
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
              text-red-600 hover:text-red-700 hover:bg-red-50 group relative
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Cerrar Sesión</span>}
            
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Cerrar Sesión
              </div>
            )}
          </button>
        </div>

        {/* User Info (when expanded) */}
        {!isCollapsed && userId && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Usuario
                </p>
                <p className="text-xs text-gray-500 truncate">
                  ID: {userId}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;