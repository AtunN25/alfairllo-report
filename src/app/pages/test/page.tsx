import React from 'react'
import SafetyTalk from '@/components/SafetyTalk'

function page() {
    return (
        <div className='p-10 bg-slate-200 space-y-5'>
            
            <div className="cartadiv">

                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">Reporte Diario de Actividades</div>
                    <p className="text-gray-700 text-base">
                        Muy buenas ... A continuacion se llenara el reporte de actividades... 
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
                </div>
            </div>


            <SafetyTalk></SafetyTalk>

        </div>
    )
}

export default page
