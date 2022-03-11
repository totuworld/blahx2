import { Avatar, Box, Center, Flex, Image, Text } from '@chakra-ui/react';
import moment from 'moment';
import { InMemberInfo } from '@/models/member/in_member_info';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';

interface Props {
  userInfo: InMemberInfo;
  instantEventInfo: InInstantEvent;
  eventState: 'none' | 'locked' | 'closed' | 'question' | 'reply' | 'pre';
}

const InstantInfo = function ({ userInfo, instantEventInfo, eventState }: Props) {
  const endDate = moment(instantEventInfo.endDate, moment.ISO_8601);
  return (
    <>
      <Image
        h="120px"
        w="full"
        src="https://images.unsplash.com/photo-1590372648787-fa5a935c2c40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
        objectFit="cover"
      />
      <Flex justify="center" mt={-8}>
        <Avatar
          size="lg"
          src={userInfo.photoURL?.replace('_normal', '')}
          css={{
            border: '2px solid white',
          }}
        />
      </Flex>
      <Box px="2" pb="2">
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
      </Box>
    </>
  );
};

export default InstantInfo;
