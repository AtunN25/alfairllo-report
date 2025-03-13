
"use client"
import React from 'react'
//import PDFGenerator from '@/components/pdf/PDFGenerator'
import { useState } from 'react';

function Page({ params }) {


  const { id } = React.use(params);
  console.log(id)
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(id);

  const handleDownloadPDF = async () => {

    if (!projectId) {
      alert('Por favor, ingresa un ID de proyecto.');
      return;
    }


    setLoading(true);
    try {
      console.log(projectId)
      const response = await fetch(`/api/pdf?project_id=${projectId}`);
      const blob = await response.blob();

      // Crear un enlace temporal para descargar el PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='bg-black h-screen w-full p-16 border rounded-lg text-white '>



      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-4 flex flex-col">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Generate PDF Report</h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">If you want to generate previous reports, change the value to the ID of the report you want to generate...</p>

        <input
          type="text"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}

          className=" bg-transparent placeholder:text-slate-400  text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />


        <button onClick={handleDownloadPDF} disabled={loading} className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
        {loading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

    </div>
  )
}

export default Page
