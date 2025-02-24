import React from 'react'

function Reception() {
    return (
        <div className="cartadiv">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Avance diario en muestrera DDH </div>
                <p className="text-gray-700 text-base">
                    ... A continuación eliga el pozo y rellene los datos
                </p>
            </div>

            <div className="px-6 ">
                <div className="w-full max-w-sm min-w-[200px]">
                    <div className="relative">
                        <select
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                            <option value="brazil">ZDDH00356 </option>
                            <option value="bucharest">ZDDH00358</option>

                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </div>
            </div>



            <div className="px-6 py-2 pb-3">
                <p className="text-gray-700 text-base ">
                    LOGGEO/MTS LIBERADOS (metros) :
                </p>

                <div className='flex gap-4'>
                    <input
                        type="decimal"

                        placeholder="Desde "
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />

                    <input
                        type="decimal"

                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />


                </div>


            </div>


            <div className="px-6 space-y-3">
                <p className="text-gray-700 text-base pb-4">
                    CORTE (metros) :
                </p>

                <div className='flex gap-4 '>
                    <input
                        type="decimal"

                        placeholder="Desde "
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />

                    <input
                        type="decimal"

                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />
                </div>

                <div className=' space-y-3'>
                    <input
                        type="decimal"

                        placeholder="metros sin cortar"
                        className="w-full   bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />

                    <input
                        type="text"

                        placeholder="observacion"
                        className="w-full   bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />
                </div>
            </div>

            <div className="px-6 space-y-3 pb-4">
                <p className="text-gray-700 text-base pb-4">
                    MUESTREO (metros) :
                </p>

                <div className='flex gap-4'>
                    <input
                        type="decimal"

                        placeholder="Desde "
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />

                    <input
                        type="decimal"

                        placeholder="Hasta"
                        className="w-1/2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />
                </div>

                <div className=' space-y-3'>
                    

                    <input
                        type="decimal"

                        placeholder="metros sin muestrear"
                        className="w-full   bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4  bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease"
                >
                    Enviar Datos
                </button>
            </div>




        </div>
    )
}

export default Reception
