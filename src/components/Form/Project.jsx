"use client"
import React, { useState } from 'react';

function Project() {

    const [reportId, setReportId] = useState(null);

    // Obtener la fecha actual en formato DD-MM-YYYY
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear un objeto con los datos del formulario
        const formData = {
            date: getCurrentDate(),
            overseer: e.target.overseer.value,
            email: e.target.email.value,
            project_id: 3
        };

        console.log(formData);

        try {
            const response = await fetch('http://localhost:3000/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Reporte enviado exitosamente. ID del reporte: ${data.report_id}`);
                setReportId(data.report_id); // Guardar el report_id en el estado
                localStorage.setItem('report_id', data.report_id);
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


            {reportId && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <p>Report successfully created. Report ID: <strong>{reportId}</strong></p>
                </div>
            )}

            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Daily Activity Report</div>
                <p className="text-gray-700 text-base">
                    Good day... Please enter the general report information below.
                </p>
            </div>

            <div className="px-6 pt-4 pb-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {getCurrentDate()} {/* Fecha actual */}
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Proyect el Zorro {/* Nombre del proyecto */}
                </span>

                <form onSubmit={handleSubmit}>
                    <div>
                        <p className="text-gray-700 text-base">Supervisor:</p>
                        <input
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Supervisor"
                            name="overseer" // Importante: el atributo "name"
                            required
                        />
                    </div>

                    <div>
                        <p className="text-gray-700 text-base">Supervisor's Email:</p>
                        <input
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Email del Supervisor"
                            name="email" // Importante: el atributo "name"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4  bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                    >
                        Submit Supervisor Information
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Project;