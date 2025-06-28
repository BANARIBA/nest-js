import axios from "axios";

export interface PokeApiHttpServices {
  get<T>(url: string): Promise<T>;
}

export class PokeFetchApiService implements PokeApiHttpServices {
  public async get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    const data: T = await res.json();
    return data;
  }
}

export class PokeApiService implements PokeApiHttpServices {
  private readonly axios = axios;

  public async get<T>(url: string): Promise<T> {
    const { data } = await this.axios.get<T>(url);
    return data;
  }

  public async post(url: string, data: any) {
    console.log({ url, data });
  }
  public async put(url: string, data: any) {
    console.log({ url, data });
  }
  public async delete(url: string) {
    console.log({ url });
  }
  public async patch(url: string, data: any) {
    console.log({ url, data });
  }
}
