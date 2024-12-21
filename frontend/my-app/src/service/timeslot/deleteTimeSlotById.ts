const handleDeleteTimeSlot = async (token: string , userID : string | null ,timeSlotId: string) => {
    try {
      // Construct the API URL with the appropriate time slot ID
      const url = `http://localhost:8080/mental-health/api/v1/time-slots/${userID}/${timeSlotId}`;
      
      // Send DELETE request
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the time slot');
      }
  
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };
  
    export default handleDeleteTimeSlot;