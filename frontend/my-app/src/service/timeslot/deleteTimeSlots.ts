const deleteTimeSlots = async (token: string, startDate: string, endDate: string) => {
    const url = `http://localhost:8080/mental-health/api/v1/time-slots/1/date-range?startDate=${startDate}&endDate=${endDate}&isAvailable=true`;
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 404) {
        console.warn('No time slots found for the specified date range.');
        return { message: 'No data found for the specified date range.' };
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Check if response has a body before parsing JSON
      const text = await response.text(); // Read the response as plain text
      return text ? JSON.parse(text) : { message: 'Time slots deleted successfully.' };
    } catch (error) {
      console.error('Error deleting time slots:', error);
      return { message: 'An error occurred while deleting time slots.' };
    }
  };
  
  export default deleteTimeSlots;
  