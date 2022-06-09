export interface DenyMessageReq {
  body: {
    uid: string;
    messageId: string;
    deny: boolean;
  };
}
