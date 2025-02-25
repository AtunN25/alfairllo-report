"use client";
import React, { useState } from 'react';

function Reception() {
    // Estado para almacenar los datos de recepción
    const [reception, setReception] = useState({
        id: 1, // Puedes generar un ID único si es necesario
        pozo: "",
        from: null,
        to: null,
        photographs: [],
        regularized: [],
        rqd: [],
        susceptibility: [],
        test_tubes_meters: [],
        observation: ""
    });

    // Función para manejar el cambio en los inputs simples
    const handleInputChange = (field, value) => {
        setReception((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // Función para manejar el cambio en los inputs de tipo "desde-hasta"
    const handleRangeChange = (field, from, to) => {
        setReception((prev) => ({
            ...prev,
            [field]: [
                ...prev[field], // Mantener los valores existentes
                { id: prev[field].length + 1, from, to } // Agregar nuevo rango
            ]
        }));
    };

    // Función para manejar el envío de datos
    const handleSubmit = () => {
        // Crear el JSON con el formato deseado
        const receptionData = {
            receptions: [reception]
        };

        // Guardar los datos en localStorage
        localStorage.setItem("reception", JSON.stringify(receptionData));
        alert("Datos guardados correctamente en localStorage.");
        console.log("Datos guardados:", receptionData); // Mostrar los datos en la consola
    };

    return (
        <div className="cartadiv">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Avance diario en muestrera DDH</div>
                <p className="text-gray-700 text-base">
                    ... A continuación elija el pozo y rellene los datos
                </p>
            </div>

           {/* Selección de pozo */}
           <div className="px-6">
                <div className="w-full max-w-sm min-w-[200px]">
                    <div className="relative">
                        <select
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                            onChange={(e) => handleInputChange("pozo", e.target.value)}
                        >
                            <option value="">Seleccione un pozo</option>
                            <option value="ZDDH00356">ZDDH00356</option>
                            <option value="ZDDH00358">ZDDH00358</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* RECEPCION DE MUESTRA (metros) */}
            <div className="px-6 py-2">
                <p className="text-gray-700 text-base pb-4">RECEPCION DE MUESTRA (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("from", parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("to", parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* FOTOGRAFIA (metros) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">FOTOGRAFIA (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("photographs", parseFloat(e.target.value), null)}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("photographs", null, parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* REGULARIZADO (metros) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">REGULARIZADO (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("regularized", parseFloat(e.target.value), null)}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("regularized", null, parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* RQD (metros) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">RQD (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("rqd", parseFloat(e.target.value), null)}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("rqd", null, parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* SUSCEPTIBILIDAD (metros) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">SUSCEPTIBILIDAD (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("susceptibility", parseFloat(e.target.value), null)}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("susceptibility", null, parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* N° DE PROBETAS (metros) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">N° DE PROBETAS (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("test_tubes_meters", parseFloat(e.target.value), null)}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("test_tubes_meters", null, parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* OBSERVACION */}
            <div className="px-6 py-4">
                <p className="text-gray-700 text-base pb-4">OBSERVACION:</p>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Actualice la observación del pozo"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("observation", e.target.value)}
                    />
                </div>
            </div>

            {/* Botón para enviar datos */}
            <div className="px-6 py-4">
                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                >
                    Enviar Datos
                </button>
            </div>
        </div>
    );
}

export default Reception;