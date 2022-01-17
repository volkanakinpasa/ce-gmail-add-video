interface ProcessVideoPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  customer_id: string;
  extra_args: any;
}
interface GetVideoPayload {
  customer_id: string;
}

interface ProcessedVideo {
  customer_id: string;
  video_url: string;
  thumbnail_url: string;
  email_sent: boolean;
  sms_sent: boolean;
}
interface ProcessVideoMessage {
  campaign: string;
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
  ProcessedVideo,
};
