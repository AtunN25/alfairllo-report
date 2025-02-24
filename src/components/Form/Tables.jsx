"use client";
import React, { useState } from 'react';


function Tables() {
    return (
        <div className="cartadiv">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Tablas</div>
                <p className="text-gray-700 text-base">
                    ... A continuación eliga la tabla
                </p>
            </div>
            <div className="px-6 pt-4 pb-4">
                <div class="w-full max-w-sm min-w-[200px]">
                    <div class="relative">
                        <select
                            class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                            <option value="brazil">AVANCE DIARIO EN MUESTRERA DDH 2024</option>
                            <option value="bucharest">Bucharest</option>
                            <option value="london">London</option>
                            <option value="washington">Washington</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tables
