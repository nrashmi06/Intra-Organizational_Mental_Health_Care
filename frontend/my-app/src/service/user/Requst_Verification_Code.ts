import axiosInstance from '@/utils/axios';
import {API_ENDPOINTS} from '@/mapper/userMapper';

const requestVerificationCode = async (accessToken: string) => {
    try {
        const response = await axiosInstance.post(
            API_ENDPOINTS.REQUEST_VERIFICATION_CODE,
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