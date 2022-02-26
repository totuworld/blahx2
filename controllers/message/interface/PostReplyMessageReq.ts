export interface PostReplyMessageReq {
  query: {
    uid: string;
    messageId: string;
  };
  body: {
    reply: string;
    author?: {
      displayName: string;
      photoURL?: string;
    };
  };
}
