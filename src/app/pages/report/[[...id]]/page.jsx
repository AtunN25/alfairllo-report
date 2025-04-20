
"use client"
import React from 'react'
//import PDFGenerator from '@/components/pdf/PDFGenerator'
import { useEffect, useState } from 'react';
import { getReports } from '@/services/report'


const formatDate = (dateString) => {

  const dateOnly = dateString.split('T')[0];
  const [year, month, day] = dateOnly.split('-');
  return `${day}/${month}/${year}`;
};

function Page({ params }) {


  const { id } = React.use(params);
  console.log(id)
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(id || '');
  const [fileName, setFileName] = useState('');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
        console.log('fronted:', data)
        console.log(reports)
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Mostrar el error directamente en la interfaz
        alert(`Error: ${error.message}`);
      }
    };

    fetchReports();
  }, []);

  const handleDownloadPDF = async () => {

    if (!projectId || !fileName) {
      alert('Por favor, ingresa un ID de proyecto y un nombre para el archivo.');
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
      a.download = `${fileName}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='bg-slate-200 h-screen w-full p-16 border rounded-lg text-white flex space-x-4'>

      <div className="max-w-sm p-6  border  rounded-lg shadow-sm bg-white cartadiv space-y-4 flex flex-col">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-black">Generate PDF Report</h5>
        </a>
        <p className="mb-3 font-normal  text-gray-800">If you want to generate previous reports, change the value to the ID of the report you want to generate...</p>

        <input
          type="number"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}

          className=" bg-transparent text-black placeholder:text-slate-400  text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />

        <input
          type="text"
          placeholder="name of the report to download"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}

          className=" bg-transparent text-black placeholder:text-slate-400  text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />


        <button onClick={handleDownloadPDF} disabled={loading} className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none  focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>



      <div className="relative overflow-x-auto flex-col border rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right  text-gray-400">
          <thead className="text-xs  uppercase  bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id report
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Overseer
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Project ID
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className=" border-b bg-gray-800  border-gray-200"
              >
                 <td className="px-6 py-4">
                  {report.id}
                </td>
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                  {formatDate(report.date)}
                </th>
                <td className="px-6 py-4">
                  {report.overseer}
                </td>
                <td className="px-6 py-4">
                  {report.email}
                </td>
                <td className="px-6 py-4">
                  {report.project_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  )
}

export default Page
