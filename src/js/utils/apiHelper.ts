import { API_PROCESSED_VIDEO_URL, API_URL } from './constants';

import { ProcessVideoPayload } from '../interfaces';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  Authorization: 'Token 5c5737b42ae2d0df38b15b3db4c7c0e519421b35',
  Host: 'api.seen.io',
};

const processVideo = async (
  campaign: string,
  payload: ProcessVideoPayload[],
): Promise<unknown> => {
  let rawResponse;
  try {
    rawResponse = await fetch(
      `${API_URL}/campaigns/${campaign.toLowerCase()}/receivers`,
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
    const searchParam = `filterByFormula=customer_id%3D%22${customerId}%22`;
    const url = `${API_PROCESSED_VIDEO_URL}&${searchParam}`;

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
