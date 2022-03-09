import { GetServerSideProps, NextPage } from 'next';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
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
import InstantMessageItem from '@/components/instant_message_item';
import { getBaseUrl } from '@/utils/get_base_url';
import getStringValueFromQuery from '@/utils/get_value_from_query';
import { memberFindByScreenNameForClient } from '@/models/member/member.client.service';
import ExtraMenuIcon from '@/components/extra_menu_icon';

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

async function closeEvent({ uid, instantEventId }: { uid: string; instantEventId: string }) {
  try {
    await InstantMessageClientService.close({
      uid,
      instantEventId,
    });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: '이벤트 종료 실패',
    };
  }
}

const InstantEventHomePage: NextPage<Props> = function ({ userInfo, instantEventInfo: propsEventInfo }) {
  const toast = useToast();
  const [message, updateMessage] = useState('');
  const [instantEventInfo, setInstantEventInfo] = useState(propsEventInfo);
  const [messageList, setMessageList] = useState<InInstantEventMessage[]>([]);

  const eventState = (() => {
    if (instantEventInfo === null) {
      return 'none';
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

  const messageListQueryKey = ['instantMessageList', userInfo?.uid, instantEventInfo?.instantEventId];
  useQuery(
    messageListQueryKey,
    async () =>
      // eslint-disable-next-line no-return-await
      await axios.get<InInstantEventMessage[]>(
        `/api/instant-event.messages.list/${userInfo?.uid}/${instantEventInfo?.instantEventId}`,
      ),
    {
      enabled: eventState === 'reply',
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

  const endDate = moment(instantEventInfo.endDate, moment.ISO_8601);

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
        <Box borderWidth="1px" borderRadius="lg" bg="white" p="6">
          <Flex>
            <Spacer />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<ExtraMenuIcon />}
                borderRadius="full"
                variant="solid"
                size="xs"
                _focus={{ boxShadow: 'none' }}
              />
              <MenuList>
                <MenuItem
                  bgColor="red.300"
                  textColor="white"
                  _hover={{ bg: 'red.500' }}
                  _focus={{ bg: 'red.500' }}
                  onClick={() => {
                    closeEvent({ uid: userInfo.uid, instantEventId: instantEventInfo.instantEventId })
                      .then(() =>
                        InstantMessageClientService.get({
                          uid: userInfo.uid,
                          instantEventId: instantEventInfo.instantEventId,
                        }),
                      )
                      .then((resp) => {
                        if (resp.status === 200 && resp.payload) {
                          setInstantEventInfo(resp.payload);
                        }
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }}
                >
                  즉석 질문 이벤트 종료처리
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex justify="center" mt={-14}>
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
        </Box>
        {eventState === 'question' && (
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
                  updateMessage('');
                }}
              >
                등록
              </Button>
            </Flex>
          </Box>
        )}
        {eventState === 'reply' && (
          <VStack spacing="12px" mt="6">
            {messageList.map((item) => (
              <InstantMessageItem
                key={`instant-message-${userInfo.uid}-${instantEventInfo.instantEventId}-${item.id}`}
                uid={userInfo.uid}
                instantEventId={instantEventInfo.instantEventId}
                item={item}
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
