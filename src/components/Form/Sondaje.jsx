"use client";
import React, { useState } from 'react';

function Sondaje() {
    // Estado para almacenar los datos de sondaje
    const [sondaje, setSondaje] = useState({
        id: 1, // Puedes generar un ID único si es necesario
        pozo: "", // Variable para almacenar el pozo seleccionado
        loggeo: { from: null, to: null },
        corte: { from: null, to: null, metrosSinCortar: null, observacion: "" },
        muestreo: { from: null, to: null, metrosSinMuestrear: null }
    });

    // Función para manejar el cambio en los inputs simples
    const handleInputChange = (field, value) => {
        setSondaje((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // Función para manejar el cambio en los inputs de tipo "desde-hasta"
    const handleRangeChange = (field, from, to) => {
        setSondaje((prev) => ({
            ...prev,
            [field]: { ...prev[field], from, to }
        }));
    };

    // Función para manejar el cambio en los inputs de corte y muestreo
    const handleCorteMuestreoChange = (field, subfield, value) => {
        setSondaje((prev) => ({
            ...prev,
            [field]: { ...prev[field], [subfield]: value }
        }));
    };

    // Obtener la fecha actual en formato DD-MM-YYYY
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Función para manejar el envío de datos
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Crear el JSON con el formato deseado
        const sondajeData = {
            sondajes: [sondaje]
        };

        // Guardar los datos en localStorage
        localStorage.setItem("sondaje", JSON.stringify(sondajeData));
        alert("Datos guardados correctamente en localStorage.");
        console.log("Datos guardados:", sondajeData);

        console.log("loggeo :",
            JSON.stringify({
                date: getCurrentDate(),
                from: sondajeData.sondajes[0].loggeo.from,
                to: sondajeData.sondajes[0].loggeo.to,
                well_id: sondajeData.sondajes[0].pozo
            })
        )
        try {
            const response = await fetch('http://localhost:3000/api/loggeo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: getCurrentDate(),
                    from: sondajeData.sondajes[0].loggeo.from,
                    to: sondajeData.sondajes[0].loggeo.to,
                    well_id: sondajeData.sondajes[0].pozo
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Loggeo enviado exitosamente.');
                alert('Loggeo enviado exitosamente.');
            } else {
                alert('Error al enviar el Loggeo');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el Loggeo');
        }

        console.log("cut :", JSON.stringify({
            date: getCurrentDate(),
            from: sondajeData.sondajes[0].corte.from,
            to: sondajeData.sondajes[0].corte.to,
            Uncut_meters: sondajeData.sondajes[0].corte.metrosSinCortar,
            observation: sondajeData.sondajes[0].corte.observacion,
            well_id: sondajeData.sondajes[0].pozo
        }))

        try {
            const response = await fetch('http://localhost:3000/api/cut', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: getCurrentDate(),
                    from: sondajeData.sondajes[0].corte.from,
                    to: sondajeData.sondajes[0].corte.to,
                    uncut_meters: sondajeData.sondajes[0].corte.metrosSinCortar,
                    observation: sondajeData.sondajes[0].corte.observacion,
                    well_id: sondajeData.sondajes[0].pozo
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('corte enviado exitosamente.');
                alert('corte enviado exitosamente.');
            } else {
                alert('Error al enviar el corte');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el corte');
        }


        console.log("sampling_surveys :",
            JSON.stringify({
                date: getCurrentDate(),
                from: sondajeData.sondajes[0].muestreo.from,
                to: sondajeData.sondajes[0].muestreo.to,
                unsampled_meters: sondajeData.sondajes[0].muestreo.metrosSinMuestrear,
                well_id: sondajeData.sondajes[0].pozo
            })
        )
        try {
            const response = await fetch('http://localhost:3000/api/samply_surverys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: getCurrentDate(),
                    from: sondajeData.sondajes[0].muestreo.from,
                    to: sondajeData.sondajes[0].muestreo.to,
                    unsampled_meters: sondajeData.sondajes[0].muestreo.metrosSinMuestrear,
                    well_id: sondajeData.sondajes[0].pozo
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('sampling_surveys enviado exitosamente.');
                alert('sampling_surveys enviado exitosamente.');
            } else {
                alert('Error al enviar el sampling_surveys');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el sampling_surveys');
        }



        // Mostrar los datos en la consola
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
                            <option value="6">ZDDH00356</option>
                            <option value="7">ZDDH00358</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* LOGGEO/MTS LIBERADOS (metros) */}
            <div className="px-6 py-2 pb-3">
                <p className="text-gray-700 text-base">LOGGEO/MTS LIBERADOS (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("loggeo", parseFloat(e.target.value), sondaje.loggeo.to)}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("loggeo", sondaje.loggeo.from, parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* CORTE (metros) */}
            <div className="px-6 space-y-3">
                <p className="text-gray-700 text-base pb-4">CORTE (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("corte", parseFloat(e.target.value), sondaje.corte.to)}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("corte", sondaje.corte.from, parseFloat(e.target.value))}
                    />
                </div>
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="metros sin cortar"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleCorteMuestreoChange("corte", "metrosSinCortar", parseFloat(e.target.value))}
                    />
                    <input
                        type="text"
                        placeholder="observacion"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleCorteMuestreoChange("corte", "observacion", e.target.value)}
                    />
                </div>
            </div>

            {/* MUESTREO (metros) */}
            <div className="px-6 space-y-3 pb-4">
                <p className="text-gray-700 text-base pb-4">MUESTREO (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("muestreo", parseFloat(e.target.value), sondaje.muestreo.to)}
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("muestreo", sondaje.muestreo.from, parseFloat(e.target.value))}
                    />
                </div>
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="metros sin muestrear"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleCorteMuestreoChange("muestreo", "metrosSinMuestrear", parseFloat(e.target.value))}
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

export default Sondaje;