import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import convertDateToString from '@/utils/convert_date_to_string';
import { InInstantEventMessage } from '@/models/instant_message/interface/in_instant_event_message';
import { useAuth } from '@/contexts/auth_user.context';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';

interface Props {
  uid: string;
  instantEventId: string;
  item: InInstantEventMessage;
  onSendComplete: () => void;
}

const InstantMessageItem = function ({ uid, instantEventId, item, onSendComplete }: Props) {
  const { authUser } = useAuth();
  const [message, updateMessage] = useState('');
  const [isAnonymous, setAnonymous] = useState(true);
  const toast = useToast();
  return (
    <Box borderRadius="md" width="full" bg="white" boxShadow="md">
      <Box>
        <Flex pl="2" pt="2" alignItems="center">
          <Avatar size="xs" src="https://bit.ly/broken-link" />
          <Text fontSize="xx-small" ml="1">
            anonymous
          </Text>
          <Text whiteSpace="pre-line" fontSize="xx-small" color="gray.500" ml="1">
            {convertDateToString(item.createAt)}
          </Text>
        </Flex>
      </Box>
      <Box p="2">
        <Box borderRadius="md" borderWidth="1px" p="2">
          <Text whiteSpace="pre-line" fontSize="sm">
            {item.message}
          </Text>
        </Box>
        <Box pt="2">
          <Divider />
          <Box display="flex" mt="2">
            <Box pt="1">
              <Avatar
                size="xs"
                src={isAnonymous ? 'https://bit.ly/broken-link' : authUser?.photoURL ?? 'https://bit.ly/broken-link'}
                mr="2"
              />
            </Box>
            <Box borderRadius="md" width="full" bg="gray.100" mr="2">
              <Textarea
                border="none"
                boxShadow="none !important"
                resize="none"
                minH="unset"
                minRows={1}
                overflow="hidden"
                fontSize="xs"
                as={ResizeTextarea}
                placeholder="댓글을 입력하세요..."
                value={message}
                onChange={(e) => {
                  updateMessage(e.target.value);
                }}
              />
            </Box>
            <Button
              disabled={message.length === 0}
              colorScheme="pink"
              bgColor="#FF75B5"
              variant="solid"
              size="sm"
              // borderRadius="full"
              onClick={() => {
                InstantMessageClientService.postReply({
                  uid,
                  instantEventId,
                  messageId: item.id,
                  reply: message,
                  author:
                    isAnonymous === false
                      ? { displayName: authUser?.displayName ?? '', photoURL: authUser?.photoURL ?? undefined }
                      : undefined,
                }).then(() => {
                  updateMessage('');
                  onSendComplete();
                });
              }}
            >
              등록
            </Button>
          </Box>
          <FormControl display="flex" alignItems="center" mt="1">
            <Switch
              size="sm"
              colorScheme="orange"
              id="anonymous"
              mr="1"
              isChecked={isAnonymous}
              onChange={() => {
                if (authUser === null) {
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
        <Box>
          {item.reply &&
            item.reply.length > 0 &&
            item.reply.map((replyItem, idx) => (
              <Box pt="2">
                {idx === 0 && <Divider />}
                <Box display="flex" mt="2">
                  <Box pt="2">
                    <Avatar
                      size="xs"
                      src={
                        replyItem.author
                          ? replyItem.author.photoURL ?? 'https://bit.ly/broken-link'
                          : 'https://bit.ly/broken-link'
                      }
                      mr="2"
                    />
                  </Box>
                  <Box borderRadius="md" p="2" width="full" bg="gray.100">
                    <Flex alignItems="center">
                      <Text fontSize="xs">{replyItem.author ? replyItem.author.displayName : 'anonymous'}</Text>
                      <Text whiteSpace="pre-line" fontSize="xs" color="gray">
                        {convertDateToString(replyItem.createAt)}
                      </Text>
                    </Flex>
                    <Text whiteSpace="pre-line" fontSize="xs">
                      {replyItem.reply}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default InstantMessageItem;
