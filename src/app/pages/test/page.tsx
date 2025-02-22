import React from 'react'
import Project from '@/components/Form/Project'
//import SafetyTalk from '@/components/SafetyTalk'
import Activities from '@/components/Form/Activities'

function page() {
    return (
        <div className='p-10 bg-slate-200 space-y-5 grid grid-cols-2'>


            <Project></Project>
           <Activities></Activities>
            
        </div>
    )
}

export default page
