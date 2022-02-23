export interface InMemberInfo {
  /** auth를 통해서 발급된 고유 id */
  uid: string;
  /** 사용자가 마음껏 변경해서 뿌릴 수 있는 이름 */
  displayName?: string;
  email?: string;
  photoURL?: string;
  /** 사용자 id 외에 별도로 사용자를 지칭할 수 있는 이름 */
  screenName: string;
  /** twitter, google 등 social media provider 구분 */
  provider: string;
}
