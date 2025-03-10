import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const processResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Response is not JSON: ${text}`);
  }
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error || "Request error");
  }
};

export const updateProfilePhotoService = async (profilePhotoUrl: string): Promise<any> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) throw new Error("Token not found. Please log in again.");
  const response = await fetch(`${API_BASE_URL}/users/me/profile-photo`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ profilePhotoUrl }),
  });
  return await processResponse(response);
};

export const deleteUserAccountService = async (): Promise<any> => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) throw new Error("Token not found. Please log in again.");
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await processResponse(response);
};
