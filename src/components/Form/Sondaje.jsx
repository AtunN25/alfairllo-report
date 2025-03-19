"use client";
import React, { useState, useEffect } from 'react';
import { getCompanies } from '@/services/company'
import { createWell, getWells } from '@/services/wellService'

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

    // Función para manejar el cambio en los inputs de tipo "From-To"
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

    //inicio con el tema de los pozos

    const [wellsGet, setWellsGet] = useState([]); // Para almacenar la lista de pozos

    useEffect(() => {
        const fetchWells = async () => {
            try {
                const data = await getWells();
                console.log('Datos obtenidos del backend:', data); // Verifica los datos obtenidos

                setWellsGet(data); // Almacena los pozos en el estado

            } catch (error) {
                console.error('Error fetching wells:', error);

            }
        };

        fetchWells();
    }, []);


    //// sub formulario ppara well


    const [showForm, setShowForm] = useState(false);
    const [companies, setCompanies] = useState([]);

    const [well, setWell] = useState({
        name: '',
        date: '',
        observations: '',
        company_id: '',
    });
    const [message, setMessage] = useState('');

    // Cargar las compañías al abrir el formulario
    const handleOpenForm = async () => {
        try {
            const data = await getCompanies();
            setCompanies(data);
            setShowForm(true);
        } catch (error) {
            setMessage('Failed to load companies');
            console.error(error);
        }
    };

    // Cerrar el formulario
    const handleCloseForm = () => {
        setShowForm(false);
        setMessage('');
        setWell({
            name: '',
            date: '',
            observations: '',
            company_id: '',
        });
    };

    // Manejar cambios en los inputs del formulario
    const handleInputChangewell = (e) => {
        const { name, value } = e.target;
        setWell({
            ...well,
            [name]: value,
        });
    };

    // Manejar el envío del formulario
    const handleSubmitwell = async (e) => {
        e.preventDefault();
        console.log(well)
        try {
            const newWell = await createWell({
                name: well.name,
                date: well.date,
                observations: well.observations,
                company_id: Number(well.company_id),
            });

            setMessage(`Well created successfully with ID: ${newWell.id}`);


            setWellsGet((prevWells) => [...prevWells, newWell]);

            setTimeout(() => {
                handleCloseForm(); // Cerrar el formulario después de 2 segundos
            }, 2000);
        } catch (error) {
            setMessage('Failed to create well');
            console.error(error);
        }
    };


    return (
        <div className="cartadiv">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Daily Progress in DDH Sampling</div>
                <p className="text-gray-700 text-base">
                    ... Please select the drill hole and fill in the data below
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
                            <option value="">Select a well</option>
                            {wellsGet.map((well) => (
                                <option key={well.id} value={well.id}>
                                    {well.name}
                                </option>
                            ))}
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>

                <div>
                    <button
                        onClick={handleOpenForm}
                        className='bg-green-700 p-2 text-white rounded-md '
                    >
                        new well
                    </button>
                </div>

                {/* Formulario emergente */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Add New Well</h2>
                            <form onSubmit={handleSubmitwell}>
                                {/* Campo: Nombre */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={well.name}
                                        onChange={handleInputChangewell}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Campo: Fecha */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Date:</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={well.date}
                                        onChange={handleInputChangewell}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Campo: Observaciones */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Observations:</label>
                                    <textarea
                                        name="observations"
                                        value={well.observations}
                                        onChange={handleInputChangewell}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Campo: Compañía */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Company:</label>
                                    <select
                                        name="company_id"
                                        value={well.company_id}
                                        onChange={handleInputChangewell}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">Select a company</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Create Well
                                    </button>
                                </div>
                            </form>

                            {/* Mensaje de éxito o error */}
                            {message && (
                                <p className={`mt-4 text-sm ${message.startsWith('Well') ? 'text-green-600' : 'text-red-600'}`}>
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* LOGGEO/MTS LIBERADOS (metros) */}
            <div className="px-6 py-2 pb-3">
                <p className="text-gray-700 text-base">LOGGING/RELEASED METERS (meters):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("loggeo", parseFloat(e.target.value), sondaje.loggeo.to)}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("loggeo", sondaje.loggeo.from, parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* CORTE (metros) */}
            <div className="px-6 space-y-3">
                <p className="text-gray-700 text-base pb-4">CUT (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("corte", parseFloat(e.target.value), sondaje.corte.to)}
                    />
                    <input
                        type="number"
                        placeholder="To"
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
                <p className="text-gray-700 text-base pb-4">SAMPLING (metros):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("muestreo", parseFloat(e.target.value), sondaje.muestreo.to)}
                    />
                    <input
                        type="number"
                        placeholder="To"
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
                    Submit Data
                </button>
            </div>
        </div>
    );
}

export default Sondaje;