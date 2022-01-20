interface ProcessVideoPayload {
  first_name: string;
  last_name: string;
  customer_id: string;
  extra_args: any;
}
interface ICampaign {
  campaign_slug: string;
  campaign_name: string;
  fields: string;
  extra_fields?: string;
  active: boolean;
  last_modified_time?: Date;
  token: string;
}
interface GetVideoPayload {
  customer_id: string;
}

interface IProcessedCampaignVideo {
  customer_id: string;
  thumbnail_url: string;
  email_thumbnail_url: string;
  landing_page_url: string;
}
interface ProcessVideoMessage {
  campaign: string;
  token: string;
  payload: ProcessVideoPayload[];
}

interface GetVideoMessage {
  campaign: string;
  payload: GetVideoPayload;
}

export {
  ProcessVideoPayload,
  ProcessVideoMessage,
  GetVideoMessage,
  GetVideoPayload,
  IProcessedCampaignVideo,
  ICampaign,
};
