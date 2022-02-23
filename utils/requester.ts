import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import isOfType from './type_guard';

export interface Resp<P> {
  status: number;
  payload?: P;
  error?: {
    statusCode?: number;
    data?: unknown;
  };
}

export async function requester<Payload>({ option }: { option: AxiosRequestConfig }): Promise<Resp<Payload>> {
  try {
    const result: AxiosResponse<Payload> = await axios(option);
    console.log({ status: result.status, reqUrl: result.config.url });
    return {
      status: result.status,
      payload: result.data,
    };
  } catch (error) {
    const isAxiosError = isOfType<AxiosError>(error, 'response');
    // 서버로부터 에러가 내려온 경우
    if (isAxiosError && error.response) {
      const errResponse = error.response;

      return {
        status: errResponse.status,
        error: {
          statusCode: errResponse.status,
          data: errResponse.data,
        },
      };
    }

    // Client 요청 에러 (XMLHttpRequest Error) - timeout
    if (isAxiosError && error.request && error.code === 'ECONNABORTED') {
      return {
        status: 499,
        error: {
          data: 'timeout',
        },
      };
    }

    // Client 요청 에러 (XMLHttpRequest Error) - 그외
    if (isAxiosError && error.request) {
      return {
        status: 400,
        error: {
          data: error.request.statusText || 'Client Request Error',
        },
      };
    }

    // Unknown Error
    return {
      status: 400,
      error: {
        data: isOfType<Error>(error, 'message') ? error.message : '',
      },
    };
  }
}
