import { API_URL } from './constants';
import { ProcessVideo } from '../interfaces';

const processVideo = async (data: ProcessVideo): Promise<unknown> => {
  const rawResponse = await fetch(`${API_URL}/campaigns/Test-Boys/receivers`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Token 5c5737b42ae2d0df38b15b3db4c7c0e519421b35',
    },
    body: JSON.stringify(data),
  });
  return { status: rawResponse.status, data: await rawResponse.json() };
};

export { processVideo };
