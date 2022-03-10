import { TriangleDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '@/contexts/auth_user.context';
import MessageItem from './message_item';
import { InMemberInfo } from '@/models/member/in_member_info';
import { InMessage, InMessageList } from '@/models/message/in_message';
import MessageClientService from '@/controllers/message/message.client.service';

interface Props {
  userInfo: InMemberInfo;
}

async function postMessage({
  message,
  uid,
  author,
}: {
  message: string;
  uid: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}): Promise<{ result: true } | { result: false; message: string }> {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요',
    };
  }
  try {
    await MessageClientService.post({ message, uid, author });
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

const DefaultPanel = function ({ userInfo }: Props) {
  const { authUser } = useAuth();
  const toast = useToast();
  const [message, updateMessage] = useState('');
  async function sendMessage() {
    const postData: {
      message: string;
      uid: string;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    } = { uid: userInfo?.uid ?? '', message };
    if (isAnonymous === false) {
      postData.author = {
        photoURL: authUser?.photoURL ?? 'https://bit.ly/broken-link',
        displayName: authUser?.displayName ?? 'anonymous',
      };
    }
    const resp = await postMessage(postData);
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
  const [isAnonymous, setAnonymous] = useState(true);
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
  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" p="2" overflow="hidden" bg="white">
        <Flex>
          <Box pt="1" pr="2">
            <Avatar
              size="xs"
              src={isAnonymous ? 'https://bit.ly/broken-link' : authUser?.photoURL ?? 'https://bit.ly/broken-link'}
            />
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
        <FormControl display="flex" alignItems="center" mt="1">
          <Switch
            size="sm"
            colorScheme="orange"
            id="anonymous"
            mr="1"
            isChecked={isAnonymous}
            onChange={() => {
              if (userInfo === null) {
                toast({
                  title: '로그인이 필요합니다',
                  position: 'top-right',
                });
                return;
              }
              setAnonymous((prev) => !prev);
            }}
          />
          <FormLabel htmlFor="anonymous" mb="0" fontSize="xx-small">
            Anonymous
          </FormLabel>
        </FormControl>
      </Box>
      {messageList.length === 0 && (
        <Box mt="6">
          <img style={{ width: '50%', margin: '0 auto' }} src="/blahx2.svg" alt="hero" />
          <Flex justify="center">
            <Box mb="6" height="100vh" fontSize="sm">
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
              screenName={userInfo.screenName}
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
    </>
  );
};

export default DefaultPanel;
