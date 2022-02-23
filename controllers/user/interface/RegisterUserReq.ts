import { InMemberInfo } from '@/models/member/member.model';

export interface RegisterUserReq {
  body: InMemberInfo & { twitterAuth?: { accessToken: string; secret: string; uid: string } };
}
