import axios, { AxiosResponse } from "axios";

type Credentials = {
  baseURL: string;
  key: string;
  username: string;
  password: string;
};

type RegisterParams = {
  EmployeeNo: string;
};

type RegisterReturn = {
  EmployeeNo: string;
};

class UKGAPI {
  credentials: Credentials;
  constructor(credentials: Credentials) {
    this.credentials = credentials;
  }

  #fetch(url: string, params: object): Promise<AxiosResponse> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "US-Customer-Api-Key": this.credentials.key,
    };
    return axios.get(url, {
      headers,
      auth: {
        username: this.credentials.username,
        password: this.credentials.password,
      },
      params,
    });
  }

  async payRegister(params: RegisterParams) {
    const url = `${this.credentials.baseURL}/payroll/v1/pay-register`;
    try {
      const { data }: { data: RegisterReturn } = await this.#fetch(url, params);
      return data;
    } catch (error) {
      throw Error("Error fetching register.", { cause: error });
    }
  }
}

const UKG = new UKGAPI({
  baseURL: "Test",
  key: "sk3o",
  username: "nwinc",
  password: "password",
});
