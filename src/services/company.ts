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

  // app/services/companyService.ts
export const createCompany = async (name: string) => {
  const response = await fetch('/api/company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || 'Failed to create company'
    );
  }

  return response.json();
};
