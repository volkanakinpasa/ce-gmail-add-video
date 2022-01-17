import { API_URL, ENVIRONMENTS } from './constants';

import { ProcessVideoPayload } from '../interfaces';
import airTableHelper from './airTableHelper';

const headers = {
  //   Authorization: Token 5c5737b42ae2d0df38b15b3db4c7c0e519421b35
  // Content-Type: application/json; charset=utf-8
  // User-Agent: PostmanRuntime/7.28.4
  // Accept: */*
  // Postman-Token: f1d804be-38fe-45de-90c7-05468e525f86
  // Host: api.storm121.com
  // Accept-Encoding: gzip, deflate, br
  // Connection: keep-alive
  // Content-Length: 131

  'Content-Type': 'application/json; charset=utf-8',
  Authorization: 'Token 5c5737b42ae2d0df38b15b3db4c7c0e519421b35',
  Host: 'api.storm121.com',
};

const getPostUrl = () => API_URL;

const getGetUrl = (customerId: string) =>
  process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION
    ? airTableHelper.createUrl(customerId)
    : airTableHelper.createUrl(customerId);

const processVideo = async (
  campaign: string,
  payload: ProcessVideoPayload[],
): Promise<unknown> => {
  let rawResponse;
  try {
    rawResponse = await fetch(
      `${getPostUrl()}/campaigns/${campaign}/receivers`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      },
    );
    if (rawResponse.status === 201)
      return { status: rawResponse.status, data: await rawResponse.json() };
    else return { status: rawResponse.status, data: rawResponse.statusText };
  } catch (error) {
    return { status: rawResponse.status, data: rawResponse.statusText };
  }
};

const getVideo = async (customerId: string): Promise<unknown> => {
  let rawResponse;
  try {
    rawResponse = await fetch(getGetUrl(customerId), {
      method: 'GET',
      headers,
    });

    if (rawResponse.status === 200)
      return { status: rawResponse.status, data: await rawResponse.json() };
    else return { status: rawResponse.status, data: rawResponse.statusText };
  } catch (error) {
    return { status: rawResponse.status, data: rawResponse.statusText };
  }
};

export { processVideo, getVideo };
