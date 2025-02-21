"use client";
import React, { useState } from 'react';

function Activities() {
    // Estado para almacenar los inputs de actividad
    const [activityInputs, setActivityInputs] = useState([]);

    // Estado para almacenar las actividades confirmadas
    const [actividades, setActividades] = useState([]);

    // Función para manejar el clic en "Agregar actividad"
    const handleAddActivity = () => {
        // Agregar un nuevo input al estado
        setActivityInputs([...activityInputs, { id: Date.now(), value: '' }]);
    };

    // Función para manejar el cambio en el input
    const handleInputChange = (id, value) => {
        const updatedInputs = activityInputs.map((input) =>
            input.id === id ? { ...input, value } : input
        );
        setActivityInputs(updatedInputs);
    };

    // Función para manejar el clic en "Confirmar actividad"
    const handleConfirmActivity = async (id) => {
        // Obtener el input correspondiente
        const input = activityInputs.find((input) => input.id === id);

        if (!input || input.value.trim() === '') {
            alert('Por favor, ingrese un título para la actividad');
            return;
        }

        // Obtener el report_id del localStorage
        const reportId = localStorage.getItem('report_id');

        if (!reportId) {
            alert('No se encontró el ID del reporte. Por favor, cree un reporte primero.');
            return;
        }

        // Crear el objeto de la actividad
        const nuevaActividad = {
            title: input.value,
            picture: 'nada', // Valor predeterminado
            report_id: parseInt(reportId) // Convertir a número
        };

        try {
            // Enviar la actividad al backend
            const response = await fetch('http://localhost:3000/api/daily-activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaActividad)
            });

            if (response.ok) {
                alert('Actividad agregada exitosamente');
                setActividades([...actividades, nuevaActividad]); // Agregar la actividad al estado

                // Eliminar el input confirmado
                const updatedInputs = activityInputs.filter((input) => input.id !== id);
                setActivityInputs(updatedInputs);
            } else {
                alert('Error al agregar la actividad');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar la actividad');
        }
    };

    return (
        <div className="cartadiv">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Lista de Actividades</div>
                <p className="text-gray-700 text-base">
                    ... A continuación ingrese la lista de actividades
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                {/* Botón "No registro ninguna actividad" */}
                <button
                    onClick={() => alert('No se registró ninguna actividad')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 ease mr-2"
                >
                    No registro ninguna actividad
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
                        <button
                            onClick={() => handleConfirmActivity(input.id)}
                            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease"
                        >
                            Confirmar actividad
                        </button>
                    </div>
                ))}

                {/* Lista de actividades confirmadas */}
                {actividades.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-bold text-lg mb-2">Actividades confirmadas:</h3>
                        <ul>
                            {actividades.map((actividad, index) => (
                                <li key={index} className="text-gray-700">
                                    {actividad.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Activities;