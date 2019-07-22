import axios, { AxiosRequestConfig } from "axios";

const client = axios.create();

const request = (opts: AxiosRequestConfig) => {
  return client(opts);
};

export default request;
