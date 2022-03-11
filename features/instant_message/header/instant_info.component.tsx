import { Avatar, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useAuth } from '@/contexts/auth_user.context';
import InstantEventHeaderSideMenu from './side_menu.component';
import { InMemberInfo } from '@/models/member/in_member_info';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';

interface Props {
  userInfo: InMemberInfo;
  instantEventInfo: InInstantEvent;
  eventState: 'none' | 'locked' | 'closed' | 'question' | 'reply' | 'pre';
  onCompleteLockOrClose: () => void;
}

const InstantInfo = function ({ userInfo, instantEventInfo, eventState, onCompleteLockOrClose }: Props) {
  const { authUser } = useAuth();
  const endDate = moment(instantEventInfo.endDate, moment.ISO_8601);
  const isOwner = authUser !== null && authUser.uid === userInfo.uid;
  return (
    <>
      {isOwner && (
        <Flex>
          <Spacer />
          <InstantEventHeaderSideMenu
            userInfo={userInfo}
            instantEventInfo={instantEventInfo}
            eventState={eventState}
            onCompleteLockOrClose={onCompleteLockOrClose}
          />
        </Flex>
      )}
      <Flex justify="center" mt={isOwner ? -20 : -14}>
        <Avatar
          size="lg"
          src={userInfo.photoURL?.replace('_normal', '')}
          css={{
            border: '2px solid white',
          }}
        />
      </Flex>
      <Text fontSize="md">{instantEventInfo?.title}</Text>
      <Text fontSize="xs">{instantEventInfo?.desc}</Text>
      {eventState === 'question' && <Text fontSize="xs">{endDate.format('YYYY-MM-DD hh:mm')}까지 질문 가능</Text>}
      {eventState === 'locked' && (
        <Center width="full" fontSize="xs">
          🚨 더 이상 댓글을 달 수 없는 상태입니다 🚨
        </Center>
      )}
      {eventState === 'closed' && (
        <Center width="full" fontSize="xs">
          🚨 종료된 이벤트 입니다 🚨
        </Center>
      )}
    </>
  );
};

export default InstantInfo;
