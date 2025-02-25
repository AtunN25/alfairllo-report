"use client";
import React, { useState } from 'react';

function Laboratory() {
    // Estado para almacenar los datos del laboratorio
    const [laboratorio, setLaboratorio] = useState({
        id: 1, // Puedes generar un ID único si es necesario
        pozo: "", // Variable para almacenar el pozo seleccionado
        nombreLaboratorio: "",
        estadoLaboratorio: "",
        nombreTRC: "",
        trcDesde: "",
        trcHasta: "",
        metrosDesde: "",
        metrosHasta: "",
        estadoMuestra: "",
        observacion: ""
    });

    // Función para manejar el cambio en los inputs
    const handleInputChange = (field, value) => {
        setLaboratorio((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // Función para manejar el envío de datos
    const handleSubmit = () => {
        // Validar que todos los campos estén completos
        if (
            !laboratorio.pozo ||
            !laboratorio.nombreLaboratorio ||
            !laboratorio.estadoLaboratorio ||
            !laboratorio.nombreTRC ||
            !laboratorio.trcDesde ||
            !laboratorio.trcHasta ||
            !laboratorio.metrosDesde ||
            !laboratorio.metrosHasta ||
            !laboratorio.estadoMuestra ||
            !laboratorio.observacion
        ) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // Crear el JSON con el formato deseado
        const laboratorioData = {
            laboratorios: [laboratorio]
        };

        // Guardar los datos en localStorage
        localStorage.setItem("laboratorio", JSON.stringify(laboratorioData));
        alert("Datos guardados correctamente en localStorage.");
        console.log("Datos guardados:", laboratorioData); // Mostrar los datos en la consola

        // Limpiar el formulario
        setLaboratorio({
            id: laboratorio.id + 1, // Incrementar el ID para el próximo registro
            pozo: "",
            nombreLaboratorio: "",
            estadoLaboratorio: "",
            nombreTRC: "",
            trcDesde: "",
            trcHasta: "",
            metrosDesde: "",
            metrosHasta: "",
            estadoMuestra: "",
            observacion: ""
        });
    };

    return (
        <div className="cartadiv">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Envío Muestras de sondaje al laboratorio</div>
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

            {/* Datos generales del laboratorio */}
            <div className="px-6 py-2 pb-3">
                <p className="text-gray-700 text-base">Ingrese datos generales del laboratorio:</p>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre del laboratorio"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.nombreLaboratorio}
                        onChange={(e) => handleInputChange("nombreLaboratorio", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Estado (ej: en funcionamiento)"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.estadoLaboratorio}
                        onChange={(e) => handleInputChange("estadoLaboratorio", e.target.value)}
                    />
                </div>
            </div>

            {/* Datos respecto a la muestra (metros) */}
            <div className="px-6 space-y-3 pb-4">
                <p className="text-gray-700 text-base pb-4">Datos respecto a la muestra (metros):</p>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre del TRC"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.nombreTRC}
                        onChange={(e) => handleInputChange("nombreTRC", e.target.value)}
                    />
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="TRC desde"
                            className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            value={laboratorio.trcDesde}
                            onChange={(e) => handleInputChange("trcDesde", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="TRC hasta"
                            className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            value={laboratorio.trcHasta}
                            onChange={(e) => handleInputChange("trcHasta", e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Metros desde"
                            className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            value={laboratorio.metrosDesde}
                            onChange={(e) => handleInputChange("metrosDesde", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Metros hasta"
                            className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            value={laboratorio.metrosHasta}
                            onChange={(e) => handleInputChange("metrosHasta", e.target.value)}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Estado"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.estadoMuestra}
                        onChange={(e) => handleInputChange("estadoMuestra", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Observación"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.observacion}
                        onChange={(e) => handleInputChange("observacion", e.target.value)}
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

export default Laboratory;