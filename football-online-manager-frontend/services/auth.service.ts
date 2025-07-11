import Axios from "@/lib/axios";
import { LoginResponse } from "@/lib/interfaces";

export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await Axios.post<LoginResponse>(`/auth`, {
    email,
    password,
  });
  return response.data;
};


export const LogoutService = async (): Promise<void> => {
  const response = await Axios.post('/auth/logout');
  return response.data
}