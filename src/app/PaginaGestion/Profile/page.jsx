"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Lock } from 'lucide-react';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    
    const token = Cookies.get('token') || localStorage.getItem('token');

    // Formulario principal
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    // Formulario de cambio de contraseña
    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        formState: { errors: passwordErrors }, 
        reset: resetPassword,
        watch: watchPassword
    } = useForm();

    const watchNewPassword = watchPassword('newPassword');

    useEffect(() => {
        if (token) {
            loadUserProfile();
        }
    }, [token]);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            // Simular llamada a API - reemplaza con tu endpoint real
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                // Llenar el formulario con los datos del usuario
                setValue('name', userData.name || '');
                setValue('email', userData.email || '');
                setValue('phone', userData.phone || '');
                setValue('address', userData.address || '');
                setValue('bio', userData.bio || '');
            } else {
                // Datos de ejemplo si no hay API
                const mockUser = {
                    id: '1',
                    name: 'Juan Pérez',
                    email: 'juan.perez@email.com',
                    phone: '+34 123 456 789',
                    address: 'Madrid, España',
                    bio: 'Profesional con experiencia en gestión de proyectos y construcción.',
                    avatar: null,
                    createdAt: '2023-01-15',
                    role: 'Manager'
                };
                setUser(mockUser);
                setValue('name', mockUser.name);
                setValue('email', mockUser.email);
                setValue('phone', mockUser.phone);
                setValue('address', mockUser.address);
                setValue('bio', mockUser.bio);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setErrorMessage('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setErrorMessage('');
        setSuccessMessage('');
        if (!isEditing) {
            // Al entrar en modo edición, resetear con los valores actuales
            reset({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                bio: user.bio
            });
        }
    };

    const onSubmitProfile = async (data) => {
        try {
            setErrorMessage('');
            setSuccessMessage('');
            
            // Simular llamada a API - reemplaza con tu endpoint real
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setSuccessMessage('Perfil actualizado correctamente');
                setIsEditing(false);
            } else {
                // Simular actualización exitosa
                setUser({ ...user, ...data });
                setSuccessMessage('Perfil actualizado correctamente');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Error al actualizar el perfil');
        }
    };

    const onSubmitPassword = async (data) => {
        try {
            setErrorMessage('');
            setSuccessMessage('');

            // Simular llamada a API - reemplaza con tu endpoint real
            const response = await fetch('/api/user/change-password', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                })
            });

            if (response.ok) {
                setSuccessMessage('Contraseña cambiada correctamente');
                setIsChangingPassword(false);
                resetPassword();
            } else {
                // Simular cambio exitoso
                setSuccessMessage('Contraseña cambiada correctamente');
                setIsChangingPassword(false);
                resetPassword();
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setErrorMessage('Error al cambiar la contraseña');
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
                // Aquí puedes agregar la lógica para subir la imagen al servidor
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="px-6 py-8">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {profileImage || user?.avatar ? (
                                        <img 
                                            src={profileImage || user.avatar} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer transition-colors">
                                        <Camera className="w-4 h-4" />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-600">{user?.role}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Miembro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                                </p>
                            </div>

                            {/* Edit Button */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleEditToggle}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                        isEditing 
                                            ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    {isEditing ? (
                                        <>
                                            <X className="w-4 h-4" />
                                            <span>Cancelar</span>
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 className="w-4 h-4" />
                                            <span>Editar</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm">{successMessage}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Profile Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
                            </div>
                            
                            <div className="p-6">
                                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                                    
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre completo
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                {...register('name', { 
                                                    required: 'El nombre es obligatorio',
                                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                                })}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                                }`}
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                {...register('email', { 
                                                    required: 'El email es obligatorio',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Email inválido'
                                                    }
                                                })}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                                }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                {...register('phone')}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                {...register('address')}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Biografía
                                        </label>
                                        <textarea
                                            {...register('bio')}
                                            disabled={!isEditing}
                                            rows={4}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
                                            placeholder="Cuéntanos sobre ti..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    {isEditing && (
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>Guardar Cambios</span>
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Account Stats */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Albaranes creados</span>
                                    <span className="font-semibold text-blue-600">24</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Proyectos activos</span>
                                    <span className="font-semibold text-green-600">8</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Clientes</span>
                                    <span className="font-semibold text-purple-600">12</span>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                            </div>
                            <div className="p-6">
                                {!isChangingPassword ? (
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="flex items-center space-x-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                                    >
                                        <Lock className="w-4 h-4" />
                                        <span>Cambiar Contraseña</span>
                                    </button>
                                ) : (
                                    <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contraseña Actual
                                            </label>
                                            <input
                                                type="password"
                                                {...registerPassword('currentPassword', { 
                                                    required: 'Contraseña actual requerida' 
                                                })}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {passwordErrors.currentPassword && (
                                                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nueva Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                {...registerPassword('newPassword', { 
                                                    required: 'Nueva contraseña requerida',
                                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                                })}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {passwordErrors.newPassword && (
                                                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirmar Nueva Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                {...registerPassword('confirmPassword', { 
                                                    required: 'Confirmar contraseña requerida',
                                                    validate: value => value === watchNewPassword || 'Las contraseñas no coinciden'
                                                })}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {passwordErrors.confirmPassword && (
                                                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                                            )}
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
                                            >
                                                Cambiar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsChangingPassword(false);
                                                    resetPassword();
                                                }}
                                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;