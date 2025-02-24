import React from 'react'
import Project from '@/components/Form/Project'
//import SafetyTalk from '@/components/SafetyTalk'
import Activities from '@/components/Form/Activities'
import SafetyTalk from '@/components/Form/SafetyTalk'
import Tables from '@/components/Form/Tables'
import Reception from '@/components/Form/Reception'

function page() {
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
                <Tables></Tables>

                <Reception></Reception>
            </div>

      

        </div>
    )
}

export default page
