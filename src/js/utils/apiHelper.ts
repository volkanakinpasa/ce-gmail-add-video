import { GetVideoPayload, ProcessVideoPayload } from '../interfaces';

import { API_URL } from './constants';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: 'Token 5c5737b42ae2d0df38b15b3db4c7c0e519421b35',
};

const getParams = (payload: any) => {
  return new URLSearchParams(payload).toString();
};

const processVideo = async (
  campaign: string,
  payload: ProcessVideoPayload[],
): Promise<unknown> => {
  let rawResponse;
  try {
    rawResponse = await fetch(`${API_URL}/campaigns/${campaign}/receivers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (rawResponse.status === 201)
      return { status: rawResponse.status, data: await rawResponse.json() };
    else return { status: rawResponse.status, data: rawResponse.statusText };
  } catch (error) {
    return { status: rawResponse.status, data: rawResponse.statusText };
  }
};

const getVideo = async (
  campaign: string,
  payload: GetVideoPayload,
): Promise<unknown> => {
  let rawResponse;
  try {
    const url = `${API_URL}/campaigns/${campaign}/receivers?${getParams(
      payload,
    )}`;

    rawResponse = await fetch(url, {
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
