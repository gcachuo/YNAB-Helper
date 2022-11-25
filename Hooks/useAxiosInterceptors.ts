import { useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import Toast from "react-native-root-toast";
import Constants from "expo-constants";
import accessToken from "../accesstoken.env";

export default function useAxiosInterceptors() {
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (request) => {
        console.info("Start:", request.method?.toUpperCase(), request.url);

        if (request.url?.includes("https://")) {
          request.baseURL = "";
          return request;
        }

        const baseUrl =
          Constants.manifest?.extra?.BASE_URL[Constants.manifest?.extra?.ENV];
        if (baseUrl) {
          request.baseURL = baseUrl;
          request.headers = request.headers || {};
          if (accessToken) {
            request.headers.Authorization = `Bearer ${accessToken}`;
            return request;
          }
        }

        return request;
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      async (
        response: AxiosResponse<{
          message: string;
          data: object;
          code: number;
        }>
      ) => {
        console.info(
          // 'End:',
          response.config.method?.toUpperCase(),
          "/" + response.config.url,
          response.status,
          response.config.method !== "get"
            ? response.data.message || response.data || response.data
            : "Completed."
        );

        return response;
      },
      async (error: unknown) => {
        if (error instanceof AxiosError) {
          try {
            switch (error.response?.status) {
              case 401:
                console.log(
                  `${401} Unauthorized. [${error.config?.method?.toUpperCase()}] /${
                    error.config?.url
                  }`
                );
                Toast.show(error.response?.data.message, {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.BOTTOM,
                });
                break;
              case 403:
                console.warn(403, "Forbidden:", "/" + error.config?.url);
                break;
              case 404:
                console.info(
                  error.config?.method?.toUpperCase(),
                  "/" + error.config?.url,
                  404,
                  (error as AxiosError<{ message: string }>).response?.data
                    .message
                );
                // Toast.show(`${404} Not Found. [/${error.config.url}]`, {
                //   duration: Toast.durations.LONG,
                //   position: Toast.positions.BOTTOM,
                // });
                break;
              case 409:
                Toast.show(409 + " Conflict. [" + error.config?.url + "]", {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.BOTTOM,
                });
                break;
              case 422:
                console.log(error.response?.data.detail);
                Toast.show(
                  `${422} Field Required. [${
                    error.response?.data?.detail[0].loc[1]
                  }] [${error.config?.method?.toUpperCase()}] /${
                    error.config?.url
                  }`,
                  {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                  }
                );
                break;
              case 500:
                console.log(error.response?.data);
                Toast.show(
                  500 +
                    " A server error occurred, try again later. [" +
                    error.config?.url +
                    "]",
                  {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                  }
                );
                break;
              case 502:
                console.warn(
                  502,
                  "Internal Server Error:",
                  "/" + error.config?.url
                );
                break;
              case 504:
                console.warn(504, "Request Timed Out:", error.config?.url);
                break;
              default:
                let errorMessage =
                  error.response?.data?.message ||
                  error.response?.data?.detail ||
                  error.response?.data ||
                  "";

                console.warn(
                  error.response?.status,
                  error.config?.method?.toUpperCase(),
                  error.config?.baseURL! + error.config?.url,
                  errorMessage
                );
                break;
            }
          } catch (e) {
            if (e instanceof Error) {
              console.warn(error.config?.url, `[${e.message}]`);
            }
          } finally {
            throw error;
          }
        }
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);
}
