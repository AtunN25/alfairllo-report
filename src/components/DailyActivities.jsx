"use client";
import React, { useState } from 'react';


function DailyActivities() {

    const [title, setTitle] = useState('');
    //const [picture, setPicture] = useState('');
    const [reportId, setReportId] = useState('');
    const [message, setMessage] = useState('');

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]); // Actualiza el estado con el archivo seleccionado
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!file) {
            setMessage('Por favor, selecciona una imagen');
            return;
        }

        console.log(file)
        const formData = new FormData()

        formData.append('title', title);
        formData.append('report_id', reportId);
        formData.append('picture', file); // Agregar el archivo de imagen

        console.log(formData)
        try {
            const response = await fetch('/api/daily_activities', {
                method: 'POST',

                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Actividad diaria agregada con éxito');
                setTitle('');
                //setPicture('');
                setReportId('');
            } else {
                setMessage(data.error || 'Error al agregar la actividad');
            }
        } catch (error) {
            setMessage(error + ' Error de conexión con el servidor');
        }
    };


    return (
        <div className="p-10 space-y-6">


            <form
                className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
                onSubmit={handleSubmit}
            >
                <div>
                    Daily Activities Form
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="picture" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Seleccione Imagen:
                    </label>
                    <input
                        type="file"
                        id="picture"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      
                    />
                </div>

                <div>
                    <label htmlFor="report_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Report ID:
                    </label>
                    <input
                        type="number"
                        id="report_id"
                        name="report_id"
                        value={reportId}
                        onChange={(e) => setReportId(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <button
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="submit"
                >
                    Submit Report
                </button>
            </form>
        </div>
    )
}

export default DailyActivities
