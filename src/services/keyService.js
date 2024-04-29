// src/services/keyService.js
const API_URL = 'http://localhost:3001/api/keys';

export const addKey = async (publicKey, privateKey) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicKey, privateKey })
    });

    const responseBody = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, Detail: ${responseBody}`);
    }

    try {
      return JSON.parse(responseBody);
    } catch (e) {
      throw new Error('Response was not valid JSON.');
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

export const assignKey = async (id, newStatus) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            const errorDetail = await response.text(); // Get more detail from the response
            throw new Error(`HTTP error! Status: ${response.status}, Detail: ${errorDetail}`);
        }

        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};
