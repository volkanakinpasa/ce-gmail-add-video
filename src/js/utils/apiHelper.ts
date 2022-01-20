import {
  ENVIRONMENTS,
  LOCAL_API_CAMPAIGNS_URL,
  LOCAL_API_CAMPAIGN_VIDEOS_POST_URL,
  LOCAL_API_CAMPAIGN_VIDEOS_URL,
  NODE_ENV,
  ZAPIER_POST_VIDEO_PROCESS_WEBHOOK_URL,
} from './constants';

import { ProcessVideoPayload } from '../interfaces';
import airTableHelper from './airTableHelper';

const getCampaignVideoPostUrl = () => {
  if (NODE_ENV === ENVIRONMENTS.PRODUCTION) {
    return ZAPIER_POST_VIDEO_PROCESS_WEBHOOK_URL;
  } else {
    return LOCAL_API_CAMPAIGN_VIDEOS_POST_URL;
  }
};

const getCampaignVideoUrl = (customerId: string) => {
  if (NODE_ENV === ENVIRONMENTS.PRODUCTION) {
    return airTableHelper.createGetCampaignVideosUrl(customerId);
  } else {
    return LOCAL_API_CAMPAIGN_VIDEOS_URL;
  }
};

const getCampaignsUrl = () => {
  if (NODE_ENV === ENVIRONMENTS.PRODUCTION) {
    return airTableHelper.createGetCampaignsUrl();
  } else {
    return LOCAL_API_CAMPAIGNS_URL;
  }
};

const processVideo = async (
  campaign: string,
  token: string,
  payload: ProcessVideoPayload[],
): Promise<unknown> => {
  let rawResponse;
  try {
    rawResponse = await fetch(`${getCampaignVideoPostUrl()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: token,
        campaign: campaign,
      },
      body: JSON.stringify(payload),
    });
    if (rawResponse.status === 200)
      return { status: rawResponse.status, data: await rawResponse.json() };
    else return { status: rawResponse.status, data: rawResponse.statusText };
  } catch (error) {
    return { status: rawResponse.status, data: rawResponse.statusText };
  }
};

const getVideo = async (customerId: string): Promise<unknown> => {
  let rawResponse;
  try {
    rawResponse = await fetch(getCampaignVideoUrl(customerId), {
      method: 'GET',
    });

    if (rawResponse.status === 200)
      return { status: rawResponse.status, data: await rawResponse.json() };
    else return { status: rawResponse.status, data: rawResponse.statusText };
  } catch (error) {
    return { status: rawResponse.status, data: rawResponse.statusText };
  }
};

const getCampaigns = async (): Promise<unknown> => {
  let rawResponse;
  try {
    rawResponse = await fetch(getCampaignsUrl(), {
      method: 'GET',
    });

    if (rawResponse.status === 200)
      return { status: rawResponse.status, data: await rawResponse.json() };
    else return { status: rawResponse.status, data: rawResponse.statusText };
  } catch (error) {
    return { status: rawResponse.status, data: rawResponse.statusText };
  }
};

export { processVideo, getVideo, getCampaigns };
