import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

export const saveAuth = async (
  token: string,
  name: string,
  role: string
) => {
  await AsyncStorage.multiSet([
    ["token", token],
    ["name", name],
    ["role", role],
  ]);
};

type User = {
  role: string | null;
  name: string | null;
};


export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("token");
};

export const getUser = async (): Promise<User> => {
  return {
    name: await AsyncStorage.getItem("name"),
    role: await AsyncStorage.getItem("role"),
  };
};


export const isLoggedIn = async () => {
  const token = await getToken();
  return token !== null;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await API.post("/auth/register", {
    name,
    email,
    password
  });

  return res.data.message;
}

export const removeAuth = async () => {
  await AsyncStorage.multiRemove(["token", "name", "role"]);
};


export const logoutService = async () => {
  await AsyncStorage.multiRemove(["token", "name", "role"]);
};
