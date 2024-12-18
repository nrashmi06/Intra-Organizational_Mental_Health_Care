import axios from 'axios';

const verifyOtpForDownload = async (verificationCode: string, accessToken: string) => {
    const apiUrl = `http://localhost:8080/mental-health/api/v1/users/verify-code-and-get-pdf?verificationCode=${verificationCode}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            responseType: 'blob' // This is important for downloading files
        });

        // Handle the response data (e.g., download the PDF)
        const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', 'file.pdf'); // or any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
};

export default verifyOtpForDownload;