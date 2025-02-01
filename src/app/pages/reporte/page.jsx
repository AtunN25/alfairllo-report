'use client'
import React from 'react'
import PDFGenerator from '@/components/pdf/PDFGenerator'
import { useState } from 'react';

function page() {
    const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pdf');
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
      <button onClick={handleDownloadPDF} disabled={loading}>
        {loading ? 'Generando PDF...' : 'Descargar PDF'}
      </button>
    </div>
  )
}

export default page
