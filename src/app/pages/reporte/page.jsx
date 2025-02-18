'use client'
import React from 'react'
import PDFGenerator from '@/components/pdf/PDFGenerator'
import { useState } from 'react';

function page() {
    const [loading, setLoading] = useState(false);
    const [projectId, setProjectId] = useState('');

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
    <div>
      <h1>Generar Reporte PDF</h1>
      <input
        type="text"
        placeholder="ID del Proyecto"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />
      <button onClick={handleDownloadPDF} disabled={loading}>
        {loading ? 'Generando PDF...' : 'Descargar PDF'}
      </button>
    </div>
  )
}

export default page
