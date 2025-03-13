"use client";
import React, { useState } from 'react';

function Activities() {
    // Estado para almacenar los inputs de actividad
    const [activityInputs, setActivityInputs] = useState([]);

    // Estado para almacenar las actividades confirmadas
    const [actividades, setActividades] = useState([]);

    const [message, setMessage] = useState('');
    // Estado para manejar el archivo seleccionado
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]); // Actualiza el estado con el archivo seleccionado
        }
    };

    const handleShowData = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Por favor, selecciona una imagen');
            return;
        }

        // Formatear el objeto JSON
        const data = {
            actividades: actividades.map((actividad) => ({
                title: actividad.title,
                picture: actividad.picture,
                subtitles: actividad.subtitles
            }))
        };

        console.log(JSON.stringify(data, null, 2)); // Mostrar el JSON en la consola

        // Crear FormData
        const formData = new FormData();

        // Convertir el JSON a string y agregarlo
        formData.append('actividades', JSON.stringify(data));

        // Agregar el archivo
        formData.append('picture', file);

        // Agregar el archivo
        const reportId = localStorage.getItem('report_id');
        if (!reportId) {
            setMessage('❌ No se encontró el report_id en el localStorage');
            return;
        }

        formData.append('report_id', reportId);

        try {
            const response = await fetch('/api/actividades', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Actividad diaria agregada con éxito');
            } else {
                setMessage(result.error || 'Error al agregar la actividad');
            }
        } catch (error) {
            setMessage('Error de conexión con el servidor: ' + error);
        }

    };


    // Función para manejar el clic en "Agregar actividad"
    const handleAddActivity = () => {
        // Agregar un nuevo input al estado
        setActivityInputs([...activityInputs, { id: Date.now(), value: '', subactivities: [] }]);
    };

    // Función para manejar el cambio en el input de actividad
    const handleInputChange = (id, value) => {
        const updatedInputs = activityInputs.map((input) =>
            input.id === id ? { ...input, value } : input
        );
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el clic en "Confirmar actividad"
    const handleConfirmActivity = (id) => {
        // Obtener el input correspondiente
        const input = activityInputs.find((input) => input.id === id);

        if (!input || input.value.trim() === '') {
            alert('Por favor, ingrese un título para la actividad');
            return;
        }

        // Crear el objeto de la actividad con los subtítulos confirmados
        const nuevaActividad = {
            title: input.value,
            picture: file ? file.name : 'No se seleccionó archivo', // Nombre del archivo o mensaje
            subtitles: input.subactivities
                .filter((sub) => sub.confirmed) // Solo subactividades confirmadas
                .map((sub) => ({ subtitle: sub.value })) // Mapear a la estructura deseada
        };

        // Agregar la actividad al estado de actividades confirmadas
        setActividades([...actividades, nuevaActividad]);

        // Eliminar el input confirmado
        const updatedInputs = activityInputs.filter((input) => input.id !== id);
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el clic en "Eliminar actividad"
    const handleDeleteActivity = (id) => {
        // Eliminar el input correspondiente
        const updatedInputs = activityInputs.filter((input) => input.id !== id);
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el clic en "Agregar subtema"
    const handleAddSubactivity = (activityId) => {
        const updatedInputs = activityInputs.map((input) =>
            input.id === activityId
                ? { ...input, subactivities: [...input.subactivities, { id: Date.now(), value: '', confirmed: false }] }
                : input
        );
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el cambio en el input de subactividad
    const handleSubactivityChange = (activityId, subactivityId, value) => {
        const updatedInputs = activityInputs.map((input) =>
            input.id === activityId
                ? {
                    ...input,
                    subactivities: input.subactivities.map((sub) =>
                        sub.id === subactivityId ? { ...sub, value } : sub
                    )
                }
                : input
        );
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el clic en "Confirmar subactividad"
    const handleConfirmSubactivity = (activityId, subactivityId) => {
        const updatedInputs = activityInputs.map((input) =>
            input.id === activityId
                ? {
                    ...input,
                    subactivities: input.subactivities.map((sub) =>
                        sub.id === subactivityId ? { ...sub, confirmed: true } : sub
                    )
                }
                : input
        );
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el clic en "Eliminar subactividad"
    const handleDeleteSubactivity = (activityId, subactivityId) => {
        const updatedInputs = activityInputs.map((input) =>
            input.id === activityId
                ? {
                    ...input,
                    subactivities: input.subactivities.filter((sub) => sub.id !== subactivityId)
                }
                : input
        );
        setActivityInputs(updatedInputs);
    };




    return (
        <div className="cartadiv">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Lista de Actividades</div>
                <p className="text-gray-700 text-base">
                    ... A continuación ingrese la lista de actividades
                </p>
            </div>
            <div className="px-6 pt-4 pb-4 space-y-4">
                {/* Input para seleccionar archivo */}
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                />

                {/* Botón "No registro ninguna actividad" */}
                <button
                    onClick={() => alert('No se registró ninguna actividad')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 ease mr-2"
                >
                    No registro
                </button>

                {/* Botón "Agregar actividad" */}
                <button
                    onClick={handleAddActivity}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease"
                >
                    Agregar actividad
                </button>

                {/* Inputs para agregar actividades */}
                {activityInputs.map((input) => (
                    <div key={input.id} className="mt-4">
                        <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            placeholder="Ingrese el título de la actividad"
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleConfirmActivity(input.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={() => handleDeleteActivity(input.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => handleAddSubactivity(input.id)}
                                className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 transition duration-300 ease"
                            >
                                Subtema
                            </button>
                        </div>

                        {/* Inputs para subactividades */}
                        {input.subactivities.map((subactivity) => (
                            <div key={subactivity.id} className="ml-8 mt-2">
                                <input
                                    type="text"
                                    value={subactivity.value}
                                    onChange={(e) =>
                                        handleSubactivityChange(input.id, subactivity.id, e.target.value)
                                    }
                                    placeholder="Ingrese el título de la subactividad"
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleConfirmSubactivity(input.id, subactivity.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSubactivity(input.id, subactivity.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {/* Lista de actividades confirmadas */}
                {actividades.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-bold text-lg mb-2">Actividades confirmadas:</h3>
                        <ul>
                            {actividades.map((actividad, index) => (
                                <li key={index} className="text-gray-700">
                                    {actividad.title} (Archivo: {actividad.picture})
                                    {actividad.subtitles.length > 0 && (
                                        <ul className="ml-4">
                                            {actividad.subtitles.map((sub, subIndex) => (
                                                <li key={subIndex} className="text-gray-500">
                                                    - {sub.subtitle}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Botón para mostrar todos los datos en un JSON */}
                <button
                    onClick={handleShowData}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                >
                    Enviar lista de Actividades
                </button>
            </div>
        </div>
    );
}

export default Activities;