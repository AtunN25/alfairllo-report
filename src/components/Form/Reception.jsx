"use client";
import React, { useState, useEffect } from 'react';
import { getCompanies, createCompany } from '@/services/company'
import { createWell, getWells } from '@/services/wellService'

function Reception() {


    // Estado para almacenar los datos de recepción
    const [reception, setReception] = useState({
        id: 1, // Puedes generar un ID único si es necesario
        pozo: "",
        from: null,
        to: null,
        photographs: { from: null, to: null  },
        regularized: { from: null, to: null },
        rqd: { from: null, to: null },
        susceptibility: { from: null, to: null },
        test_tubes_meters: { from: null, to: null },
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
        setReception(prev => ({
            ...prev,
            [field]: {
                ...prev[field],  
                from: from !== null ? from : prev[field].from,  
                to: to !== null ? to : prev[field].to           
            }
        }));
    };

    // Función para enviar datos a cualquier tabla
    const sendDataToTable = async (tableName, body) => {
        console.log(JSON.stringify(body))
        try {
            const response = await fetch(`/api/${tableName}`, {
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

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Función para manejar el envío de datos
    const handleSubmit = async (e) => {

        console.log(reception);

        const receptionPost = {
            from: reception.from,
            to: reception.to,
            well_id: reception.pozo,
            date: getCurrentDate()
        };

        try {
            console.log(JSON.stringify(receptionPost))

            const response = await fetch('/api/reception', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(receptionPost)
            });

            const data = await response.json();

            console.log('Respuesta de reception:', data);

            if (response.ok) {

                const receptionId = data.reception_id;
              
                await sendDataToTable('photograph', {
                    from: reception.photographs.from,
                    to: reception.photographs.to,
                    reception_id: receptionId
                });
        
                await sendDataToTable('regularized', {
                    from: reception.regularized.from,
                    to: reception.regularized.to,
                    reception_id: receptionId
                });
        
                await sendDataToTable('rqd', {
                    from: reception.rqd.from,
                    to: reception.rqd.to,
                    reception_id: receptionId
                });
                
                await sendDataToTable('susceptibility', {
                    from: reception.susceptibility.from,
                    to: reception.susceptibility.to,
                    reception_id: receptionId
                });


                await sendDataToTable('test_tubes_meters', {
                    from: reception.test_tubes_meters.from,
                    to: reception.test_tubes_meters.to,
                    reception_id: receptionId,
                    from_meters: reception.from_meters,
                    to_meters: reception.to_meters
                });
                
                
                alert('Datos enviados exitosamente a todas las tablas');

            } else {
                alert('Error al enviar el reporte');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el reporte');
        }
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



    //company
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');


  const handleOpenCompanyForm = () => {
    setShowCompanyForm(true);
  };


  const handleCloseCompanyForm = () => {
    setShowCompanyForm(false);
    setNewCompanyName('');
  };


  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      alert('El nombre de la compañía es requerido');
      return;
    }

    try {
      const createdCompany = await createCompany(newCompanyName);

      const updatedCompanies = await getCompanies();
      setCompanies(updatedCompanies);

      setWell(prev => ({
        ...prev,
        company_id: createdCompany.id.toString()
      }));
      alert("successfully created company")
      handleCloseCompanyForm();
    } catch (error) {
      alert(error.message);
    }
  };

    return (
        <div className="cartadiv">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Daily Progress in DDH Sample Room</div>
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

                                <label className="block text-sm font-medium text-gray-700">Company:</label>
                                {/* Campo: Compañía */}
                                <div className="mb-4 flex space-x-21">
                                    <div className="flex justify-between items-center">

                                        <button
                                            type="button"
                                            onClick={handleOpenCompanyForm}
                                            className="text-xs bg-slate-600 p-2 rounded-md text-white "
                                        >
                                            + New Company
                                        </button>
                                    </div>

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

            {/* Modal para nueva compañía */}
            {showCompanyForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Add New Company</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Company Name:</label>
                            <input
                                type="text"
                                value={newCompanyName}
                                onChange={(e) => setNewCompanyName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleCloseCompanyForm}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateCompany}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                            >
                                Create Company
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SAMPLE RECEPTION (meters) */}
            <div className="px-6 py-2">
                <p className="text-gray-700 text-base pb-4">SAMPLE RECEPTION (meters):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("from", parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("to", parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* PHOTOGRAPHY (meters) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">PHOTOGRAPHY (meters):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("photographs", parseFloat(e.target.value), null)}
                        value={reception.photographs.from || ''}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("photographs", null, parseFloat(e.target.value))}
                        value={reception.photographs.to || ''}
                    />
                </div>
            </div>

            {/* REGULARIZED (meters) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">REGULARIZED (meters):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("regularized", parseFloat(e.target.value), null)}
                        value={reception.regularized.from || ''}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("regularized", null, parseFloat(e.target.value))}
                        value={reception.regularized.to || ''}
                    />
                </div>
            </div>

            {/* RQD (meters) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">RQD (meters):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("rqd", parseFloat(e.target.value), null)}
                        value={reception.rqd.from || ''}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("rqd", null, parseFloat(e.target.value))}
                        value={reception.rqd.to || ''}
                    />
                </div>
            </div>

            {/* SUSCEPTIBILITY (meters) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">SUSCEPTIBILITY (meters):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("susceptibility", parseFloat(e.target.value), null)}
                        value={reception.susceptibility.from || ''}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("susceptibility", null, parseFloat(e.target.value))}
                        value={reception.susceptibility.to || ''}
                    />
                </div>
            </div>

            {/* NUMBER OF TEST TUBES (meters) */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">NUMBER OF TEST TUBES (meters):</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("test_tubes_meters", parseFloat(e.target.value), null)}
                        value={reception.test_tubes_meters.from || ''}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleRangeChange("test_tubes_meters", null, parseFloat(e.target.value))}
                        value={reception.test_tubes_meters.to || ''}
                    />
                </div>
            </div>

            {/* METERS */}
            <div className="px-6">
                <p className="text-gray-700 text-base pb-4">METERS:</p>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="From"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("from_meters", parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="To"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("to_meters", parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* OBSERVATION */}
            <div className="px-6 py-4">
                <p className="text-gray-700 text-base pb-4">OBSERVATION:</p>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Update the well observation"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        onChange={(e) => handleInputChange("observation", e.target.value)}
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

export default Reception;