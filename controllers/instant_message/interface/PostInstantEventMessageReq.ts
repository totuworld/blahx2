export interface PostInstantEventMessageReq {
  body: {
    uid: string;
    instantEventId: string;
    message: string;
  };
}
