"use client"
import React, { useState } from 'react';

import Project from '@/components/Form/Project'
//import SafetyTalk from '@/components/SafetyTalk'
import Activities from '@/components/Form/Activities'
import SafetyTalk from '@/components/Form/SafetyTalk'
//import Tables from '@/components/Form/Tables'

import Reception from '@/components/Form/Reception' //valor 1
import Sondaje from '@/components/Form/Sondaje' //valor 2
import Laboratory from '@/components/Form/Laboratory' //valor 3

function Page() {

    // Estado para manejar la selección
    const [selectedComponent, setSelectedComponent] = useState('3'); // Valor inicial '3' para Laboratory

    // Función para manejar el cambio en el select
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedComponent(event.target.value);
    };

    // Renderizar el componente correspondiente
    const renderComponent = () => {
        switch (selectedComponent) {
            case '1':
                return <Reception />;
            case '2':
                return <Sondaje />;
            case '3':
                return <Laboratory />;
            default:
                return <Laboratory />;
        }
    };

    return (
        <div className='p-10 bg-slate-200  flex space-x-5'>

            <div className='flex-col space-y-5  '>
                <Project></Project>
                <SafetyTalk></SafetyTalk>
            </div>

            <div className='flex-col '>
                <Activities></Activities>
            </div>

            <div className='flex-col space-y-5'>
                <div className="cartadiv">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Tablas</div>
                        <p className="text-gray-700 text-base">
                            ... A continuación eliga la tabla
                        </p>
                    </div>
                    <div className="px-6 pt-4 pb-4">
                        <div className="w-full max-w-sm min-w-[200px]">
                            <div className="relative">
                                <select
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                                    value={selectedComponent}
                                    onChange={handleSelectChange}
                                >
                                    <option value="1">AVANCE DIARIO EN MUESTRERA DDH </option>
                                    <option value="2">METROS DE SONDAJE DDH </option>
                                    <option value="3">ENVIO DE MUESTRAS AL LABORATORIO</option>
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <div className='flex-col space-y-5'>


                <div className='flex-col space-y-5'>
                    {renderComponent()}
                </div>
            </div>


        </div>
    )
}

export default Page
