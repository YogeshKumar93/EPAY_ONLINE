import apiClient from "./apiClient";

export const loginApi = (username, password) =>
  apiClient.post("/auth/qrLogin", { username, password }).then((res) => res.data);
