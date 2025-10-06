import api from "./axios";
import type { AxiosRequestHeaders } from "axios";

const apiInterceptor = api.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  } as AxiosRequestHeaders,
});

export default apiInterceptor;
