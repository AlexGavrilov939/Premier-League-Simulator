import { StatusCodes } from 'http-status-codes';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const onRequest = (config: AxiosRequestConfig, shouldAddCancelToken = true): AxiosRequestConfig => ({
  ...config,
  cancelToken: shouldAddCancelToken ? source.token : undefined,
  headers: {
    ...config.headers,
  },
});

const onResponse = (response: AxiosResponse): AxiosResponse => response;

const onResponseError = (error: AxiosError): void | AxiosResponse => {
  const statusCode = error.response?.status;
  if (statusCode === StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE) {
    window.location.reload();
  }
  return error.response;
};

let source: any;
export const getApiInstance = (
    shouldAddCancelToken = true,
): AxiosInstance => {
  source = axios.CancelToken.source();
  const apiInstance: AxiosInstance = axios.create();
  apiInstance.defaults.headers.get.Accept = 'application/json';

  apiInstance.interceptors.request.use((config) => onRequest(config, shouldAddCancelToken));
  apiInstance.interceptors.response.use(onResponse, onResponseError);
  return apiInstance;
};

export const cancelRequest = (): void => {
  if (source) {
    source.cancel();
  }
};
