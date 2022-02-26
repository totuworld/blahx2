export interface PostMessageReq {
  body: {
    uid: string;
    message: string;
    author?: {
      displayName: string;
      photoURL?: string;
    };
  };
}
