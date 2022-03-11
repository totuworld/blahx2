import { Avatar, Box, Button, FormControl, FormLabel, Switch, Textarea, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import { useAuth } from '@/contexts/auth_user.context';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';

interface Props {
  uid: string;
  instantEventId: string;
  messageId: string;
  locked: boolean;
  onSendComplete: () => void;
}

const InstantMessageItemReplyInput = function ({ locked, uid, instantEventId, messageId, onSendComplete }: Props) {
  const { authUser } = useAuth();
  const [message, updateMessage] = useState('');
  const [isAnonymous, setAnonymous] = useState(true);
  const toast = useToast();
  return (
    <>
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
            disabled={locked}
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
          disabled={message.length === 0 || locked === true}
          colorScheme="pink"
          bgColor="#FF75B5"
          variant="solid"
          size="sm"
          // borderRadius="full"
          onClick={() => {
            InstantMessageClientService.postReply({
              uid,
              instantEventId,
              messageId,
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
    </>
  );
};

export default InstantMessageItemReplyInput;
