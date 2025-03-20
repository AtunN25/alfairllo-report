// services/reportService.js

export const getReports = async () => {
    try {
      const response = await fetch('/api/report', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  

      if (!response.ok) {
        throw new Error('Error fetching reports');
      }
  
      const data = await response.json();
      console.log(data.reports)
      return data.reports; // Retorna solo el array de reportes
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error; // Propaga el error para manejarlo en el componente
    }
  };