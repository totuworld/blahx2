export interface InInstantEvent {
  instantEventId: string;
  title: string;
  desc?: string;
  startDate?: string;
  endDate?: string;
  /** 질문 가능 여부를 확인 */
  closed?: boolean;
}
