import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

class AxiosService {
  private token: string;
  private initialUrl: string;

  constructor() {
    this.token = localStorage.getItem('token') as string;

    // this.initialUrl = 'https://apisocialhamster.homka122.ru/api'
    this.initialUrl = 'http://localhost:5000/api';
  }

  updateToken() {
    this.token = localStorage.getItem('token') as string;
  }

  async get(path: string, options?: AxiosRequestConfig) {
    this.updateToken();

    const url = this.initialUrl + path;
    const finalOptions = {
      headers: { authorization: `Bearer ${this.token}` },
      withCredentials: true,
      ...options,
    };

    try {
      const res = await axios.get(url, finalOptions);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return err.response?.data;
    }
  }

  async getRawResponse(path: string, options: AxiosRequestConfig) {
    this.updateToken();

    const url = this.initialUrl + path;
    const finalOptions = {
      headers: { authorization: `Bearer ${this.token}` },
      withCredentials: true,
      ...options,
    };

    try {
      const res = await axios.get(url, finalOptions);
      return res;
    } catch (error) {
      const err = error as AxiosError;
      return err.response as AxiosResponse;
    }
  }

  async post(path: string, body: object, options?: AxiosRequestConfig) {
    this.updateToken();

    const url = this.initialUrl + path;
    const finalOptions = {
      headers: { authorization: `Bearer ${this.token}` },
      withCredentials: true,
      ...options,
    };

    try {
      const res = await axios.post(url, body, finalOptions);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return err.response?.data;
    }
  }

  async patchPhoto(path: string, body: FormData) {
    this.updateToken();

    const url = this.initialUrl + path;
    const options = {
      headers: { authorization: `Bearer ${this.token}`, 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    };

    try {
      const res = await axios.patch(url, body, options);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return err.response?.data;
    }
  }
}

export const axiosService = new AxiosService();
