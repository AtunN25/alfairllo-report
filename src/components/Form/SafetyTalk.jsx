"use client";
import React, { useState } from 'react';

function SafetyTalk() {
    // Estado para los datos estáticos
    const [staticData, setStaticData] = useState({
        speaker: "",
        time: ""
    });

    // Estado para almacenar los inputs de actividad
    const [activityInputs, setActivityInputs] = useState([]);

    // Estado para almacenar las actividades confirmadas
    const [actividades, setActividades] = useState([]);

    // Contador para IDs (comienza desde 1)
    const [idCounter, setIdCounter] = useState(1);

    // Función para manejar el clic en "Agregar actividad"
    const handleAddActivity = () => {
        // Agregar un nuevo input al estado con un ID secuencial
        setActivityInputs([...activityInputs, { id: idCounter, value: '' }]);
        // Incrementar el contador de IDs
        setIdCounter(idCounter + 1);
    };

    // Función para manejar el cambio en el input
    const handleInputChange = (id, value) => {
        const updatedInputs = activityInputs.map((input) =>
            input.id === id ? { ...input, value } : input
        );
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el clic en "Eliminar actividad"
    const handleDeleteActivity = (id) => {
        // Eliminar el input correspondiente
        const updatedInputs = activityInputs.filter((input) => input.id !== id);
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el clic en "Confirmar actividad"
    const handleConfirmActivity = (id) => {
        const input = activityInputs.find((input) => input.id === id);
        if (input && input.value.trim() !== "") {
            setActividades([...actividades, { id: input.id, subtitle: input.value }]);
            handleDeleteActivity(id); // Elimina el input después de confirmar
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reportId = localStorage.getItem('report_id');

        // Crear un objeto con los datos del formulario
        const formData = {
            safety_talks: [
                {
                    speaker: staticData.speaker,
                    time: staticData.time,
                    subtitles: actividades
                }
            ]
        };

        if (!reportId) {
            alert('No se encontró el report_id en el localStorage');
            return;
        }


        console.log(JSON.stringify(formData, null, 2));

        const safety_talk = {
            speaker: staticData.speaker,
            time: staticData.time,
            report_id: parseInt(reportId, 10) //lo convierte a base 10
        };

        console.log(JSON.stringify(safety_talk, null, 2));

        try {
            const response = await fetch('/api/safety_talk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(safety_talk)
            });

            const data = await response.json();

            console.log(data)

            if (response.ok) {
                alert(`Safety Talk enviado exitosamente. ID : ${data.safety_talk_id}`);


                // Enviar cada subtitle con el safety_talk_id
                await Promise.all(
                    actividades.map(async (actividad) => {
                        const subtitleData = {
                            subtitle: actividad.subtitle,
                            safety_talk_id: data.safety_talk_id
                        };

                        const subtitleResponse = await fetch('/api/safety_talk_Subtitle', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(subtitleData)
                        });

                        if (!subtitleResponse.ok) {
                            throw new Error(`Error al enviar subtitle: ${actividad.subtitle}`);
                        }
                    })
                );

            } else {
                alert('Error al enviar Safety Talk');
            }


        } catch {
            console.error('Error:', error);
            alert('Error al enviar Safety Talk');
        }

       
    };

    return (
        <div className="cartadiv">
             <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Talk</div>
        <p className="text-gray-700 text-base">
            Hello... Please enter the general information regarding the Talk session below.
        </p>
    </div>
            <div className="px-6 pt-4 pb-4">
                <form onSubmit={handleSubmit}>
                    {/* Input para el supervisor */}
                    <div>
                        <p className="text-gray-700 text-base">Talk Supervisor:</p>
                        <input
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Supervisor"
                            name="speaker"
                            value={staticData.speaker}
                            onChange={(e) => setStaticData({ ...staticData, speaker: e.target.value })}
                            required
                        />
                    </div>

                    {/* Input para el tiempo de duración */}
                    <div>
                        <p className="text-gray-700 text-base">Duration Time:</p>
                        <input
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Duration Time"
                            name="time"
                            value={staticData.time}
                            onChange={(e) => setStaticData({ ...staticData, time: e.target.value })}
                            required
                            type="text"
                        />
                    </div>

                    {/* Botón para agregar subtítulos */}
                    <button
                        type="button"
                        onClick={handleAddActivity}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease mt-4"
                    >
                        Add Subtitle
                    </button>

                    {/* Inputs para subtítulos dinámicos */}
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
                                    type="button"
                                    onClick={() => handleConfirmActivity(input.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease"
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteActivity(input.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Lista de actividades confirmadas */}
                    {actividades.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold text-lg mb-2">Confirmed Activities:</h3>
                            <ul>
                                {actividades.map((actividad) => (
                                    <li key={actividad.id} className="text-gray-700">
                                        {actividad.subtitle}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Botón para enviar el formulario */}
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                    >
                         Submit Talk Data
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SafetyTalk;