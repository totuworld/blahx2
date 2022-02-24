export interface ListMessageReq {
  query: {
    screenName?: string;
    uid?: string;
    page?: number;
    size?: number;
  };
}
