export interface InInstantEventMessage {
  id: string;
  message: string;
  createAt: string;
  updateAt?: string;
  replyCount: number;
}

export interface InInstantEventMessageReply {
  reply: string;
  createAt: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}
