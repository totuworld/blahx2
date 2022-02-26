import { InMemberInfo } from '@/models/member/in_member_info';

export interface RegisterUserReq {
  body: InMemberInfo & { twitterAuth?: { accessToken: string; secret: string; uid: string } };
}
