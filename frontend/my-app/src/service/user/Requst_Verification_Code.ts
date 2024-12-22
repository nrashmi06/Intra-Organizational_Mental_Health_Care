import axios from 'axios';

const requestVerificationCode = async (accessToken: string) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/mental-health/api/v1/users/request-verification-code',
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response;
    } catch (error) {
        console.error('Error requesting verification code:', error);
    }
};

export default requestVerificationCode;