// app/lib/api.ts
export const createWell = async (wellData: {
    name: string;
    date: string;
    observations: string;
    company_id: number;
}) => {
    const response = await fetch('/api/well', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(wellData),
    });

    if (!response.ok) {
        throw new Error('Failed to create well');
    }

    return response.json();
};

export const getWells = async () => {
    try {
      const response = await fetch('/api/well', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch wells');
      }
  
      const wells = await response.json();
      console.log('Datos obtenidos :',wells); // Lista de pozos

      return wells; 
    } catch (error) {
      console.error('Error:', error);
    }
  };