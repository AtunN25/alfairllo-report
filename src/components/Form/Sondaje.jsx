"use client";
import React, { useState, useEffect } from 'react';
import { getCompanies } from '@/services/company'
import { createWell, getWells } from '@/services/wellService'

function Sondaje() {


    const [loggeoData, setLoggeoData] = useState({
        pozo: "",
        from: null,
        to: null,
    });

    const [cutData, setCutData] = useState({
        pozo: "",
        from: null,
        to: null,
        metrosSinCortar: null,
        observacion: "",
    });

    const [samplingData, setSamplingData] = useState({
        pozo: "",
        from: null,
        to: null,
        metrosSinMuestrear: null,
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


    // Enviar solo Loggeo
    const handleSubmitLoggeo = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/loggeo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: getCurrentDate(),
                    from: loggeoData.from,
                    to: loggeoData.to,
                    well_id: loggeoData.pozo,
                }),
            });
            if (response.ok) alert('Loggeo enviado exitosamente.');
            else alert('Error al enviar Loggeo');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar Loggeo');
        }
    };

    // Enviar solo Cut
    const handleSubmitCut = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/cut', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: getCurrentDate(),
                    from: cutData.from,
                    to: cutData.to,
                    uncut_meters: cutData.metrosSinCortar,
                    observation: cutData.observacion,
                    well_id: cutData.pozo,
                }),
            });
            if (response.ok) alert('Corte enviado exitosamente.');
            else alert('Error al enviar Corte');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar Corte');
        }
    };

    // Enviar solo Sampling
    const handleSubmitSampling = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/samply_surverys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: getCurrentDate(),
                    from: samplingData.from,
                    to: samplingData.to,
                    unsampled_meters: samplingData.metrosSinMuestrear,
                    well_id: samplingData.pozo,
                }),
            });
            if (response.ok) alert('Muestreo enviado exitosamente.');
            else alert('Error al enviar Muestreo');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar Muestreo');
        }
    };


    //inicio con el tema de los pozos
    const [wellsGet, setWellsGet] = useState([]);

    useEffect(() => {
        const fetchWells = async () => {
            try {
                const data = await getWells();
                console.log('Datos obtenidos del backend:', data);

                setWellsGet(data);

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

            <div className="px-6 py-2 pb-3">
                <p className="text-gray-700 text-base">LOGGING/RELEASED METERS (meters):</p>
                <div className="flex gap-4">
                    <select
                        value={loggeoData.pozo}
                        onChange={(e) => setLoggeoData({ ...loggeoData, pozo: e.target.value })}
                        className="w-1/2 bg-transparent text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4"
                    >
                        <option value="">Select a well</option>
                        {wellsGet.map((well) => (
                            <option key={well.id} value={well.id}>{well.name}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setLoggeoData({ ...loggeoData, from: parseFloat(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setLoggeoData({ ...loggeoData, to: parseFloat(e.target.value) })}
                    />
                </div>
                <button
                    onClick={handleSubmitLoggeo}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                >
                    Submit Logging
                </button>
            </div>

            {/* CORTE (metros) */}
            <div className="px-6 space-y-3">
                <p className="text-gray-700 text-base pb-4">CUT (metros):</p>
                <div className="flex gap-4">
                    <select
                        value={cutData.pozo}
                        onChange={(e) => setCutData({ ...cutData, pozo: e.target.value })}
                        className="w-1/2 bg-transparent text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4"
                    >
                        <option value="">Select a well</option>
                        {wellsGet.map((well) => (
                            <option key={well.id} value={well.id}>{well.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setCutData({ ...cutData, from: parseFloat(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setCutData({ ...cutData, to: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Uncut meters"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setCutData({ ...cutData, metrosSinCortar: parseFloat(e.target.value) })}
                    />
                    <input
                        type="text"
                        placeholder="Observation"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setCutData({ ...cutData, observacion: e.target.value })}
                    />
                </div>
                <button
                    onClick={handleSubmitCut}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                >
                    Submit Cut
                </button>
            </div>

            {/* MUESTREO (metros) */}
            <div className="px-6 space-y-3 pb-4">
                <p className="text-gray-700 text-base pb-4">SAMPLING (metros):</p>
                <div className="flex gap-4">
                    <select
                        value={samplingData.pozo}
                        onChange={(e) => setSamplingData({ ...samplingData, pozo: e.target.value })}
                        className="w-1/2 bg-transparent text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4"
                    >
                        <option value="">Select a well</option>
                        {wellsGet.map((well) => (
                            <option key={well.id} value={well.id}>{well.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setSamplingData({ ...samplingData, from: parseFloat(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setSamplingData({ ...samplingData, to: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Unsampled meters"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => setSamplingData({ ...samplingData, metrosSinMuestrear: parseFloat(e.target.value) })}
                    />
                </div>
                <button
                    onClick={handleSubmitSampling}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                >
                    Submit Sampling
                </button>
            </div>

        </div>
    );
}

export default Sondaje;