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
        from_meters: 0,
        to_meters: 0,
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

    // Función para enviar datos a cualquier tabla
    const sendDataToTable = async (tableName, body) => {
        try {
            const response = await fetch(`http://localhost:3000/api/${tableName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`Error al enviar a la tabla ${tableName}`);
            }

            console.log(`${tableName} enviada correctamente.`);
        } catch (error) {
            console.error(`Error en ${tableName}:`, error);
        }
    };

    // Función para manejar el envío de datos
    const handleSubmit = async (e) => {

        console.log(reception);

        const receptionPost = {
            from: reception.from,
            to: reception.to,
            well_id: reception.pozo
        };

        try {
            console.log(JSON.stringify(receptionPost))

            const response = await fetch('http://localhost:3000/api/reception', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(receptionPost)
            });

            const data = await response.json();

            if (response.ok) {
                alert(`reception enviado exitosamente. ID de reception: ${data.reception_id}`);

                // Enviar cada subtitle con el safety_talk_id

                const photographs = reception.photographs;

                const regularized = reception.regularized;
                const rqd = reception.rqd;
                const susceptibility = reception.susceptibility;
                const test_tubes_meters = reception.test_tubes_meters;

                const mergedPhotograph = reception.photographs.map(photo => ({
                    from: photographs.find(photo => photo.from !== null)?.from || null,
                    to: [...photographs].reverse().find(photo => photo.to !== null)?.to || null,
                    reception_id: data.reception_id
                }));

                if (response.ok) {
                    alert(`reception enviado exitosamente. ID de reception: ${data.reception_id}`);

                    // Obtener los arrays de la recepción
                    const photographs = reception.photographs;
                    const regularized = reception.regularized;
                    const rqd = reception.rqd;
                    const susceptibility = reception.susceptibility;
                    const test_tubes_meters = reception.test_tubes_meters;

                    // Generar los objetos para cada tabla
                    const mergedPhotograph = photographs.map(photo => ({
                        from: photographs.find(photo => photo.from !== null)?.from || null,
                        to: [...photographs].reverse().find(photo => photo.to !== null)?.to || null,
                        reception_id: data.reception_id
                    }));

                    const mergedRegularized = regularized.map(item => ({
                        from: regularized.find(item => item.from !== null)?.from || null,
                        to: [...regularized].reverse().find(item => item.to !== null)?.to || null,
                        reception_id: data.reception_id
                    }));

                    const mergedRQD = rqd.map(item => ({
                        from: rqd.find(item => item.from !== null)?.from || null,
                        to: [...rqd].reverse().find(item => item.to !== null)?.to || null,
                        reception_id: data.reception_id
                    }));

                    const mergedSusceptibility = susceptibility.map(item => ({
                        from: susceptibility.find(item => item.from !== null)?.from || null,
                        to: [...susceptibility].reverse().find(item => item.to !== null)?.to || null,
                        reception_id: data.reception_id
                    }));

                    const mergedTestTubesMeters = test_tubes_meters.map(item => ({
                        from: test_tubes_meters.find(item => item.from !== null)?.from || null,
                        to: [...test_tubes_meters].reverse().find(item => item.to !== null)?.to || null,
                        reception_id: data.reception_id,
                        from_meters: reception.from_meters|| 0,
                        to_meters: reception.to_meters || 0
                    }));

                    // Verificar los datos antes de enviarlos
                    console.log('photograph:', mergedPhotograph[0]);
                    console.log('regularized:', mergedRegularized[0]);
                    console.log('rqd:', mergedRQD[0]);
                    console.log('susceptibility:', mergedSusceptibility[0]);
                    console.log('test_tubes_meters:', mergedTestTubesMeters[0]);

                    // Enviar los objetos a las tablas correspondientes
                    await sendDataToTable('photograph', mergedPhotograph[0]);
                    await sendDataToTable('regularized', mergedRegularized[0]);
                    await sendDataToTable('rqd', mergedRQD[0]);
                    await sendDataToTable('susceptibility', mergedSusceptibility[0]);
                    await sendDataToTable('test_tubes_meters', mergedTestTubesMeters[0]);

                    alert('Datos enviados exitosamente a todas las tablas.');
                }

            } else {
                alert('Error al enviar el reporte');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el reporte');
        }
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

            {/* METROS*/}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">METROS :</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Desde"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("from_meters", parseFloat(e.target.value))}
                       
                    />
                    <input
                        type="number"
                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("to_meters", parseFloat(e.target.value))}
                        
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