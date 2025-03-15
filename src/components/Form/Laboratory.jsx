"use client";
import React, { useState, useEffect } from 'react';
import { getCompanies } from '@/services/company'
import { createWell, getWells } from '@/services/wellService'

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
        console.log("Datos enviados:", JSON.stringify({
            laboratory_name: laboratorio.nombreLaboratorio,
            status: laboratorio.estadoLaboratorio,
            well_id: laboratorio.pozo
        })); // Mostrar los datos en la consola

        try {
            const response = await fetch('http://localhost:3000/api/lab_shipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    laboratory_name: laboratorio.nombreLaboratorio,
                    status: laboratorio.estadoLaboratorio,
                    well_id: laboratorio.pozo
                })
            });

            const datalab = await response.json();

            if (response.ok) {
                alert(`Laboratorio enviado exitosamente. ID del laboratio: ${datalab.laboratorio_id}`);

                console.log(JSON.stringify({
                    date: getCurrentDate(),
                    trc: laboratorio.nombreTRC,
                    trc_from: laboratorio.trcDesde,
                    trc_to: laboratorio.trcHasta,
                    meters_from: laboratorio.metrosDesde,
                    meters_to: laboratorio.metrosHasta,
                    observation: laboratorio.observacion,
                    status: laboratorio.estadoMuestra,
                    lab_shipment_id: datalab.laboratorio_id
                }))
                try {
                    const response = await fetch('http://localhost:3000/api/sample_shipment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            date: getCurrentDate(),
                            trc: laboratorio.nombreTRC,
                            trc_from: laboratorio.trcDesde,
                            trc_to: laboratorio.trcHasta,
                            meters_from: laboratorio.metrosDesde,
                            meters_to: laboratorio.metrosHasta,
                            observation: laboratorio.observacion,
                            status: laboratorio.estadoMuestra,
                            lab_shipment_id: datalab.laboratorio_id
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log('sample_shipment enviado exitosamente.');
                        alert('sample_shipment enviado exitosamente.');
                    } else {
                        alert('Error al enviar el sample_shipment');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al enviar el sample_shipment');
                }


            } else {
                alert('Error al enviar el sample_shipment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el sample_shipment');
        }


    };


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
                <div className="font-bold text-xl mb-2">Drilling Sample Shipping to Laboratory</div>
                <p className="text-gray-700 text-base">
                    ... Below, select the well and fill in the data
                </p>
            </div>

            {/* Well selection */}
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

            {/* General laboratory data */}
            <div className="px-6 py-2 pb-3">
                <p className="text-gray-700 text-base">Enter general laboratory data:</p>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Laboratory name"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.nombreLaboratorio}
                        onChange={(e) => handleInputChange("nombreLaboratorio", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Status (e.g., operational)"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.estadoLaboratorio}
                        onChange={(e) => handleInputChange("estadoLaboratorio", e.target.value)}
                    />
                </div>
            </div>

            {/* Sample data (meters) */}
            <div className="px-6 space-y-3 pb-4">
                <p className="text-gray-700 text-base pb-4">Sample data (meters):</p>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="TRC name"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.nombreTRC}
                        onChange={(e) => handleInputChange("nombreTRC", e.target.value)}
                    />
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="TRC from"
                            className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            value={laboratorio.trcDesde}
                            onChange={(e) => handleInputChange("trcDesde", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="TRC to"
                            className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            value={laboratorio.trcHasta}
                            onChange={(e) => handleInputChange("trcHasta", e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Meters from"
                            className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            value={laboratorio.metrosDesde}
                            onChange={(e) => handleInputChange("metrosDesde", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Meters to"
                            className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            value={laboratorio.metrosHasta}
                            onChange={(e) => handleInputChange("metrosHasta", e.target.value)}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Status"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.estadoMuestra}
                        onChange={(e) => handleInputChange("estadoMuestra", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Observation"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        value={laboratorio.observacion}
                        onChange={(e) => handleInputChange("observacion", e.target.value)}
                    />
                </div>
            </div>

            {/* Button to submit data */}
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

export default Laboratory;