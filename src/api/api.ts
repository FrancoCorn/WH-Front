import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { ErrorView, ErrorViewType } from './errors/errorView';
import { BASE_URL } from './endpoints';

type RequestType = 'GET' | 'POST' | 'PUT' | 'HEAD' | 'OPTIONS' | 'DELETE';

class ApiService {
    axios: AxiosInstance;
    constructor(baseURL: string) {
        this.axios = axios.create({ baseURL });

        // Retries if network error or 5xx, on any request
        axiosRetry(this.axios, { retries: 4, retryDelay: axiosRetry.exponentialDelay, retryCondition: this.shouldRetry });
        // Using "bind" to be able to call "this" refering to ApiService inside the callback methods
        this.axios.interceptors.response.use(this.handleSuccess.bind(this), this.handleError.bind(this));
    }

    // Retry if network error or 5xx error
    private shouldRetry(error: AxiosError) {
        return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
    }

    private handleSuccess(response: AxiosResponse) {
        return response;
    }

    private handleError(_error: AxiosError) {
        throw new ErrorView(ErrorViewType.Toast, "Ha ocurrido un error inesperado, por favor vuelva a intentarlo");
    }

    private async request(path: string, method: RequestType, config?: AxiosRequestConfig) {
        const response = await this.axios.request({ url: path, method, ...config });
        return response.data;
    }

    async get(path: string, config?: AxiosRequestConfig) {
        return this.request(path, 'GET', config);
    }
    async post(path: string, config?: AxiosRequestConfig) {
        return this.request(path, 'POST', config);
    }
    async put(path: string, config?: AxiosRequestConfig) {
        return this.request(path, 'PUT', config);
    }
    async delete(path: string, config?: AxiosRequestConfig) {
        return this.request(path, 'DELETE', config);
    }
}

let apiServiceInstance: ApiService | null = null;
export function getApiService() {
    if (!apiServiceInstance) {
        apiServiceInstance = new ApiService(BASE_URL);
    }
    return apiServiceInstance;
};