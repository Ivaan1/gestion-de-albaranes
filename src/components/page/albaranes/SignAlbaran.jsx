import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { uploadSignature, openSignedPDF } from '@/app/utils/api';

const SignAlbaran = ({ albaran, clientName, projectName, onSignComplete, onCancel, token }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSigned, setIsSigned] = useState(albaran.signed || false);
    const [updatedAlbaran, setUpdatedAlbaran] = useState(albaran);
    const signatureRef = useRef(null);
    const [pdfAlbaran, setPdfAlbaran] = useState(null);

    const handleClearSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
        }
    };

    const handleSaveSignature = async () => {
        if (!signatureRef.current || signatureRef.current.isEmpty()) {
            setError('Por favor, añade tu firma antes de continuar');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const canvas = signatureRef.current.getCanvas();

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    setError('Error al procesar la firma');
                    setIsLoading(false);
                    return;
                }

                const signatureFile = new File([blob], 'signature.png', { type: 'image/png' });

                try {
                    const response = await uploadSignature(albaran._id, signatureFile, token);
                    console.log('Albarán firmado correctamente:', response.data);
                    
                    // Actualizar el estado local con la respuesta del backend
                    if (response && response.data) {
                        setUpdatedAlbaran(response.data);
                    }
                    
                    setIsSigned(true);
                    setPdfAlbaran(response.data.pdfUrl || null);
                    // No llamamos a onSignComplete inmediatamente, dejamos que el usuario descargue si quiere
                } catch (error) {
                    console.error('Error signing albaran:', error);
                    setError('Error al firmar el albarán. Por favor, inténtalo de nuevo.');
                } finally {
                    setIsLoading(false);
                }

            }, 'image/png');

        } catch (error) {
            console.error('Error processing signature:', error);
            setError('Error al procesar la firma');
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        try {
            console.log('Abriendo PDF firmado:', pdfAlbaran);
            window.open(pdfAlbaran, '_blank');
        } catch (error) {
            console.error('Error abriendo PDF:', error);
            alert('Error al abrir el PDF. Por favor, inténtalo de nuevo.');
        }
    };

    const handleFinish = () => {
        onSignComplete();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isSigned ? 'Albarán Firmado' : 'Firmar Albarán'}
                        </h1>
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            ← Volver a la lista
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-600">Código:</span>
                            <p className="font-medium">
                                {updatedAlbaran.albaranCode || `#${updatedAlbaran._id.slice(-6)}`}
                            </p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Cliente:</span>
                            <p className="font-medium">{clientName}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Proyecto:</span>
                            <p className="font-medium">{projectName}</p>
                        </div>
                    </div>

                    {updatedAlbaran.workdate && (
                        <div className="mt-3 text-sm">
                            <span className="font-medium text-gray-600">Fecha:</span>
                            <p className="font-medium">
                                {new Date(updatedAlbaran.workdate).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    )}

                    {isSigned && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        ¡Albarán firmado correctamente!
                                    </p>
                                    <p className="text-sm text-green-700">
                                        Ya puedes descargar el PDF firmado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Signature Canvas */}
                {!isSigned && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Añadir Firma</h2>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
                            <SignatureCanvas
                                ref={signatureRef}
                                canvasProps={{
                                    width: 600,
                                    height: 200,
                                    className: 'signature-canvas bg-white rounded border'
                                }}
                                backgroundColor="white"
                                penColor="black"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleClearSignature}
                                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                            >
                                Limpiar Firma
                            </button>
                            <button
                                onClick={handleSaveSignature}
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                {isLoading && (
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isLoading ? 'Firmando...' : 'Firmar Albarán'}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Work Details */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Trabajo</h2>
                    
                    {updatedAlbaran.description && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Descripción:</h3>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                                {updatedAlbaran.description}
                            </p>
                        </div>
                    )}

                    {updatedAlbaran.hours && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Horas trabajadas:</h3>
                            <p className="text-gray-900 font-medium">{updatedAlbaran.hours} horas</p>
                        </div>
                    )}

                    {updatedAlbaran.materials && updatedAlbaran.materials.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Materiales utilizados:</h3>
                            <div className="bg-gray-50 p-3 rounded border">
                                <ul className="space-y-1">
                                    {updatedAlbaran.materials.map((material, index) => (
                                        <li key={index} className="text-gray-900 text-sm">
                                            • {material.name} - Cantidad: {material.quantity} {material.unit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {updatedAlbaran.observations && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Observaciones:</h3>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                                {updatedAlbaran.observations}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-wrap gap-3 justify-end">
                        {isSigned && (
                            <>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Descargar PDF
                                </button>
                                <button
                                    onClick={handleFinish}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                                >
                                    Finalizar
                                </button>
                            </>
                        )}
                        
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                        >
                            {isSigned ? 'Cerrar' : 'Cancelar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignAlbaran;