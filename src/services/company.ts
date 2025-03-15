// app/services/companyService.ts
export const getCompanies = async () => {
    const response = await fetch('/api/company', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
  
    return response.json();
  };