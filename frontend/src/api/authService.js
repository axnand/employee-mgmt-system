import axios from "axios";

export const loginUser = async (credentials) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
    credentials
  );
  return response.data;
};
