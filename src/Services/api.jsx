import axios from "axios";

export const studentAPI = {
  processScan: async (regNo) => {
    try {
      // Direct URL use karo testing ke liye
      const response = await axios({
        method: "post",
        url: "https://qr-node-backend.onrender.com/api/scanQR",
        data: {
          registrationNo: regNo,
        },
        withCredentials: true, // Cookies aur Auth ke liye
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Success Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Axios Detailed Error:", error.response || error);
      throw error;
    }
  },
};
