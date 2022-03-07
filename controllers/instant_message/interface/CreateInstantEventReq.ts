export interface CreateInstantEventReq {
  body: {
    uid: string;
    title: string;
    desc?: string;
    startDate: string;
    endDate: string;
  };
}
