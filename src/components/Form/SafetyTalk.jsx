"use client";
import React, { useState } from 'react';

function SafetyTalk() {

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


    // Función para manejar el clic en "Eliminar actividad"
    const handleDeleteActivity = (id) => {
        // Eliminar el input correspondiente
        const updatedInputs = activityInputs.filter((input) => input.id !== id);
        setActivityInputs(updatedInputs);
    };

    return (
        <div className="cartadiv">

            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Jornada de charlas</div>
                <p className="text-gray-700 text-base">
                    Muy buenas ... A continuación ingrese los datos generales respecto a la Jornada de Charla
                </p>
            </div>
            <div className="px-6 pt-4 pb-4">

                <form>
                    <div>
                        <p className="text-gray-700 text-base">Personal Supervisor:</p>
                        <input
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Supervisor"
                            name="overseer" // Importante: el atributo "name"
                            required
                        />
                    </div>

                    <div>
                        <p className="text-gray-700 text-base">Tiempo de duracion:</p>
                        <input
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Email del Supervisor"
                            name="duracion" // Importante: el atributo "name"
                            required
                            type='number'
                        />
                    </div>

                    <button
                        onClick={handleAddActivity}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease"
                    >
                        Agregar subtitulo 
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
                            </div>
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

                    <button
                        type="submit"
                        className="mt-4  bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                    >
                        Enviar Datos de la Charla
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SafetyTalk
