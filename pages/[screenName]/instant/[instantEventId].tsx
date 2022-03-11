import { GetServerSideProps, NextPage } from 'next';
import { Avatar, Box, Button, Flex, Spacer, Textarea, useToast, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import ResizeTextarea from 'react-textarea-autosize';
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import moment from 'moment';
import { InMemberInfo } from '@/models/member/in_member_info';
import { ServiceLayout } from '@/components/containers/service_layout';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';
import { InInstantEventMessage } from '@/models/instant_message/interface/in_instant_event_message';
import { getBaseUrl } from '@/utils/get_base_url';
import getStringValueFromQuery from '@/utils/get_value_from_query';
import { memberFindByScreenNameForClient } from '@/models/member/member.client.service';
import InstantInfo from '@/features/instant_message/header/instant_info.component';
import FirebaseAuthClient from '@/models/auth/firebase_auth_client';
import { useAuth } from '@/contexts/auth_user.context';
import InstantMessageItem from '@/features/instant_message/message_item/instant_message_item.component';
import InstantEventHeaderSideMenu from '@/features/instant_message/header/side_menu.component';

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

const InstantEventHomePage: NextPage<Props> = function ({ userInfo, instantEventInfo: propsEventInfo }) {
  const toast = useToast();
  const { authUser } = useAuth();
  const [message, updateMessage] = useState('');
  const [instantEventInfo, setInstantEventInfo] = useState(propsEventInfo);
  const [messageList, setMessageList] = useState<InInstantEventMessage[]>([]);

  const eventState = (() => {
    if (instantEventInfo === null) {
      return 'none';
    }
    if (
      instantEventInfo.locked !== undefined &&
      instantEventInfo.locked === true &&
      instantEventInfo.closed === false
    ) {
      // 잠긴경우
      return 'locked';
    }
    if (instantEventInfo.closed === true) {
      // 완전히 종료된 경우
      return 'closed';
    }
    const now = moment();
    const startDate = moment(instantEventInfo.startDate, moment.ISO_8601);
    const endDate = moment(instantEventInfo.endDate, moment.ISO_8601);
    // 질문 가능한 기간 내 인가?
    if (now.isBetween(startDate, endDate, undefined, '[]')) {
      return 'question';
    }
    // 질문 가능한 기간이 넘었나?
    if (now.isAfter(endDate)) {
      return 'reply';
    }
    return 'pre';
  })();

  const messageListQueryKey = ['instantMessageList', userInfo?.uid, instantEventInfo?.instantEventId, authUser];
  useQuery(
    messageListQueryKey,
    async () => {
      const token = await FirebaseAuthClient.getInstance().Auth.currentUser?.getIdToken();
      const resp = await axios.get<InInstantEventMessage[]>(
        `/api/instant-event.messages.list/${userInfo?.uid}/${instantEventInfo?.instantEventId}`,
        {
          headers: token
            ? {
                authorization: token,
              }
            : {},
        },
      );
      return resp;
    },
    {
      enabled: eventState === 'reply' || eventState === 'locked',
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

  const isOwner = authUser !== null && authUser.uid === userInfo.uid;

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
        <Box rounded="md" overflow="hidden" bg="white">
          {isOwner && (
            <Box width="full" float="left" height="0">
              <Flex pr="2" pt="2">
                <Spacer />
                <InstantEventHeaderSideMenu
                  userInfo={userInfo}
                  instantEventInfo={instantEventInfo}
                  eventState={eventState}
                  onCompleteLockOrClose={() => {
                    InstantMessageClientService.get({
                      uid: userInfo.uid,
                      instantEventId: instantEventInfo.instantEventId,
                    }).then((resp) => {
                      if (resp.status === 200 && resp.payload) {
                        setInstantEventInfo(resp.payload);
                      }
                    });
                  }}
                />
              </Flex>
            </Box>
          )}
          <InstantInfo userInfo={userInfo} instantEventInfo={instantEventInfo} eventState={eventState} />
        </Box>
        {eventState === 'question' && (
          <Box borderWidth="1px" borderRadius="lg" p="2" overflow="hidden" bg="white" mt="6">
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
                  updateMessage('');
                }}
              >
                등록
              </Button>
            </Flex>
          </Box>
        )}
        {(eventState === 'reply' || eventState === 'locked') && (
          <VStack spacing="12px" mt="6">
            {messageList.map((item) => (
              <InstantMessageItem
                key={`instant-message-${userInfo.uid}-${instantEventInfo.instantEventId}-${item.id}`}
                uid={userInfo.uid}
                instantEventId={instantEventInfo.instantEventId}
                item={item}
                locked={eventState === 'locked'}
                onSendComplete={() => {
                  console.info('send complete');
                  InstantMessageClientService.getMessageInfo({
                    uid: userInfo.uid,
                    instantEventId: instantEventInfo.instantEventId,
                    messageId: item.id,
                  }).then((info) => {
                    if (info.payload === undefined) {
                      return;
                    }
                    setMessageList((prev) => {
                      const findPrevIndex = prev.findIndex((fv) => fv.id === info.payload!.id);
                      if (findPrevIndex < 0) {
                        return prev;
                      }
                      const updateArr = [...prev];
                      updateArr[findPrevIndex] = info.payload!;
                      return updateArr;
                    });
                  });
                }}
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
