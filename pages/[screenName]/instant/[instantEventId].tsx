import { GetServerSideProps, NextPage } from 'next';
import { Avatar, Box, Button, Flex, Text, Textarea, useToast, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import ResizeTextarea from 'react-textarea-autosize';
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { InMemberInfo } from '@/models/member/in_member_info';
import { ServiceLayout } from '@/components/containers/service_layout';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';
import { InInstantEventMessage } from '@/models/instant_message/interface/in_instant_event_message';
import InstantMessageItem from '@/components/instant_message_item';
import { getBaseUrl } from '@/utils/get_base_url';
import getStringValueFromQuery from '@/utils/get_value_from_query';
import { memberFindByScreenNameForClient } from '@/models/member/member.client.service';

interface Props {
  host: string;
  userInfo: InMemberInfo | null;
  instantEventInfo: InInstantEvent | null;
}

async function postMessage({ message, uid, instantEventId }: { message: string; uid: string; instantEventId: string }) {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요',
    };
  }
  try {
    await InstantMessageClientService.post({
      uid,
      instantEventId,
      message,
    });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: '등록 실패',
    };
  }
}

const InstantEventHomePage: NextPage<Props> = function ({ userInfo, instantEventInfo }) {
  const toast = useToast();
  const [message, updateMessage] = useState('');
  const [messageList, setMessageList] = useState<InInstantEventMessage[]>([]);

  const messageListQueryKey = ['instantMessageList', userInfo?.uid, instantEventInfo?.instantEventId];
  useQuery(
    messageListQueryKey,
    async () =>
      // eslint-disable-next-line no-return-await
      await axios.get<InInstantEventMessage[]>(
        `/api/instant-event.messages.list/${userInfo?.uid}/${instantEventInfo?.instantEventId}`,
      ),
    {
      enabled: true, // TODO: 답변 등록이 가능한 시점을 기준으로만 데이터를 패치해야함.
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data.status === 200 && data.data) {
          setMessageList(data.data);
        }
      },
    },
  );

  if (userInfo === null || instantEventInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  return (
    <ServiceLayout height="100vh" backgroundColor="gray.200">
      <Box maxW="md" mx="auto" pt="6">
        <Link href={`/${userInfo.screenName}`}>
          <a>
            <Button fontSize="sm" mb="2" leftIcon={<ChevronLeftIcon />}>
              {userInfo.screenName} 홈으로
            </Button>
          </a>
        </Link>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Box display="flex" p="6">
            <Avatar size="lg" src={userInfo.photoURL?.replace('_normal', '')} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">@{userInfo.screenName}</Text>
            </Flex>
          </Box>
        </Box>
        <Box>
          <h4>{instantEventInfo?.title}</h4>
          <Box>{instantEventInfo?.desc}</Box>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p="2" overflow="hidden" bg="white">
          <Flex>
            <Box pt="1" pr="2">
              <Avatar size="xs" src="https://bit.ly/broken-link" />
            </Box>
            <Textarea
              bg="gray.100"
              border="none"
              boxShadow="none !important"
              placeholder="익명으로 질문할 내용을 입력해주세요"
              borderRadius="md"
              resize="none"
              minH="unset"
              minRows={1}
              maxRows={7}
              overflow="hidden"
              fontSize="xs"
              mr="2"
              as={ResizeTextarea}
              value={message}
              onChange={(e) => {
                // 최대 7줄만 스크린샷에 표현되니 7줄 넘게 입력하면 제한걸어야한다.
                if (e.target.value) {
                  const lineCount = (e.target.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1) + 1;
                  if (lineCount > 7) {
                    toast({
                      title: '최대 7줄까지만 입력가능합니다',
                      position: 'top-right',
                    });
                    return;
                  }
                }
                updateMessage(e.target.value);
              }}
            />
            <Button
              disabled={message.length === 0}
              bgColor="#FFB86C"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              onClick={async () => {
                const resp = await postMessage({
                  message,
                  uid: userInfo.uid,
                  instantEventId: instantEventInfo.instantEventId,
                });
                if (resp.result === false) {
                  toast({
                    title: '메시지 등록 실패',
                    position: 'top-right',
                  });
                }
              }}
            >
              등록
            </Button>
          </Flex>
        </Box>
        {messageList.length > 0 && (
          <VStack spacing="12px" mt="6">
            {messageList.map((item) => (
              <InstantMessageItem
                key={`instant-message-${userInfo.uid}-${instantEventInfo.instantEventId}-${item.id}`}
                item={item}
              />
            ))}
          </VStack>
        )}
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const host = getBaseUrl(true);
  const screenName = getStringValueFromQuery({ query, field: 'screenName' });
  const instantEventId = getStringValueFromQuery({ query, field: 'instantEventId' });
  if (screenName === undefined || instantEventId === undefined) {
    return {
      props: {
        host,
        userInfo: null,
        instantEventInfo: null,
      },
    };
  }
  try {
    const userInfo = await memberFindByScreenNameForClient({ isServer: true, screenName });
    if (userInfo.payload?.uid === undefined) {
      return {
        props: {
          host,
          userInfo: userInfo.payload ?? null,
          instantEventInfo: null,
        },
      };
    }
    const instantInfo = await InstantMessageClientService.get({
      uid: userInfo.payload?.uid,
      instantEventId,
      isServer: true,
    });
    return {
      props: {
        host,
        userInfo: userInfo.payload ?? null,
        instantEventInfo: instantInfo.payload ?? null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        host,
        userInfo: null,
        instantEventInfo: null,
      },
    };
  }
};

export default InstantEventHomePage;
