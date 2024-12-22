import axios from "axios";

const verifyOtpForDownload = async (
  verificationCode: string,
  accessToken: string
) => {
  const apiUrl = `http://localhost:8080/mental-health/api/v1/users/verify-code-and-get-pdf?verificationCode=${verificationCode}`;

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
