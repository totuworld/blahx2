import { GetServerSideProps, NextPage } from 'next';
import { Avatar, Box, Button, Flex, Spacer, Text, Textarea, useToast, VStack } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import ResizeTextarea from 'react-textarea-autosize';
import { InMemberInfo } from '@/models/member/in_member_info';
import getStringValueFromQuery from '@/utils/get_value_from_query';
import { memberFindByScreenNameForClient } from '@/models/member/member.client.service';
import MessageClientService from '@/controllers/message/message.client.service';
import { InMessage, InMessageList } from '@/models/message/in_message';
import { ServiceLayout } from '@/components/containers/service_layout';
import { useAuth } from '@/contexts/auth_user.context';
import MessageItem from '@/components/message_item';

/**
 * 각 사용자의 home
 * 프로필 이미지, 닉네임, id가 출력
 * 질문을 작성할 수 있는 text area
 *
 * 기존에 대답한 내용이 아래쪽에 보여짐
 * 각 질문에서 답변 보기를 클릭하면 상세 화면으로 진입
 */

interface Props {
  userInfo: InMemberInfo | null;
}

async function postMessage({
  message,
  uid,
}: {
  message: string;
  uid: string;
}): Promise<{ result: true } | { result: false; message: string }> {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요',
    };
  }
  try {
    await MessageClientService.post({ message, uid });
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

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  const toast = useToast();
  const { authUser } = useAuth();
  const [message, updateMessage] = useState('');
  async function sendMessage() {
    const resp = await postMessage({ uid: userInfo?.uid ?? '', message });
    if (resp.result === false) {
      toast({
        title: '메시지 등록 실패',
        position: 'top-right',
      });
    }
  }
  const [listLoadingSalt, setSalt] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  // const queryClient = useQueryClient();
  const messageListQueryKey = ['messageList', userInfo?.uid, page, listLoadingSalt];
  useQuery(
    messageListQueryKey,
    // eslint-disable-next-line no-return-await
    async () => await axios.get<InMessageList>(`/api/messages.list?uid=${userInfo?.uid}&page=${page}`),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data.status === 200 && data.data) {
          setTotalPages(data.data.totalPages);
          setMessageList((prev) => {
            if (page === 1 && prev.length > 0) {
              return [...data.data.content];
            }
            return [...prev, ...data.data.content];
          });
        }
      },
    },
  );
  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }
  return (
    <ServiceLayout backgroundColor="gray.200">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Box display="flex" p="6">
            <Avatar size="lg" src={userInfo.photoURL?.replace('_normal', '')} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">@{userInfo.screenName}</Text>
            </Flex>
          </Box>
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
              placeholder="무엇이 궁금한가요?"
              borderRadius="md"
              resize="none"
              minH="unset"
              minRows={1}
              overflow="hidden"
              fontSize="xs"
              mr="2"
              as={ResizeTextarea}
              value={message}
              onChange={(e) => {
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
              onClick={() => {
                sendMessage().finally(() => {
                  updateMessage('');
                  setPage(1);
                  setSalt((p) => !p);
                });
              }}
            >
              등록
            </Button>
          </Flex>
        </Box>
        {messageList.length === 0 && (
          <Box mt="6">
            <img style={{ width: '50%', margin: '0 auto' }} src="/blahx2.svg" alt="hero" />
            <Flex justify="center">
              <Box mb="6" height="100vh" fontSize="xs">
                첫 질문을 남겨보세요
              </Box>
            </Flex>
          </Box>
        )}
        {messageList.length > 0 && (
          <VStack spacing="12px" mt="6">
            {messageList.map((item) => (
              <MessageItem
                key={`message-${userInfo.uid}-${item.id}`}
                uid={userInfo.uid}
                photoURL={userInfo.photoURL ?? ''}
                displayName={userInfo.displayName ?? ''}
                isOwner={authUser !== null && authUser.uid === userInfo.uid}
                item={item}
                onSendComplete={() => {
                  MessageClientService.get({ uid: userInfo.uid, messageId: item.id }).then((updateInfo) => {
                    if (updateInfo.payload !== undefined) {
                      setMessageList((prev) => {
                        const findIndex = prev.findIndex((fv) => fv.id === updateInfo.payload!.id);
                        if (findIndex >= 0) {
                          const updateArr = [...prev];
                          updateArr[findIndex] = updateInfo.payload!;
                          return updateArr;
                        }
                        return prev;
                      });
                    }
                  });
                }}
              />
            ))}
          </VStack>
        )}
        {totalPages > page && (
          <Button
            width="full"
            mt="2"
            leftIcon={<TriangleDownIcon />}
            fontSize="sm"
            onClick={() => {
              setPage((p) => p + 1);
            }}
          >
            더보기
          </Button>
        )}
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const screenName = getStringValueFromQuery({ query, field: 'screenName' });
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
  try {
    const userInfo = await memberFindByScreenNameForClient({ isServer: true, screenName });
    return {
      props: {
        userInfo: userInfo.payload ?? null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
      },
    };
  }
};

export default UserHomePage;
