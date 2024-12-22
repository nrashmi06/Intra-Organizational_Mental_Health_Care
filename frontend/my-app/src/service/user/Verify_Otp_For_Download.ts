import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";

const verifyOtpForDownload = async (
  verificationCode: string,
  accessToken: string
) => {
  const apiUrl = `${API_ENDPOINTS.VERIFY_OTP}?verificationCode=${verificationCode}`;

  try {
    const response = await axios.post(apiUrl, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/pdf",
      },
      responseType: "blob", 
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export default verifyOtpForDownload;
