import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import convertDateToString from '@/utils/convert_date_to_string';
import { InInstantEventMessage } from '@/models/instant_message/interface/in_instant_event_message';
import { useAuth } from '@/contexts/auth_user.context';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';
import ExtraMenuIcon from '@/components/extra_menu_icon';
import HeartIcon from '@/components/heart_icon';
import InstantMessageItemReplyInput from './reply_input.component';
import InstantEventMessageReply from './reply.component';

interface Props {
  uid: string;
  instantEventId: string;
  locked: boolean;
  item: InInstantEventMessage;
  onSendComplete: () => void;
}

const InstantMessageItem = function ({ uid, instantEventId, item, onSendComplete, locked }: Props) {
  const { authUser } = useAuth();
  const toast = useToast();
  const isOwner = authUser !== null && authUser.uid === uid;

  function sendVote(isUpvote: boolean, voted: boolean) {
    if (voted === true) {
      toast({
        title: '이 의견은 이미 투표했습니다.',
        status: 'warning',
        position: 'top-right',
      });
      return;
    }
    if (authUser === null) {
      toast({
        title: '로그인이 필요합니다',
        position: 'top-right',
      });
      return;
    }
    InstantMessageClientService.voteMessageInfo({
      uid,
      instantEventId,
      messageId: item.id,
      isUpvote,
    }).then((resp) => {
      if (resp.status !== 200 && resp.error !== undefined) {
        toast({
          title: (resp.error.data as { message: string }).message,
          status: 'warning',
          position: 'top-right',
        });
        return;
      }
      onSendComplete();
    });
  }

  function denyMessage() {
    if (authUser === null) {
      toast({
        title: '로그인이 필요합니다',
        position: 'top-right',
      });
      return;
    }
    InstantMessageClientService.denyMessage({
      uid,
      instantEventId,
      messageId: item.id,
    }).then((resp) => {
      if (resp.status !== 200 && resp.error !== undefined) {
        toast({
          title: (resp.error.data as { message: string }).message,
          status: 'warning',
          position: 'top-right',
        });
        return;
      }
      onSendComplete();
    });
  }

  return (
    <Box borderRadius="md" width="full" bg="white" boxShadow="md">
      <Box>
        <Flex px="2" pt="2" alignItems="center">
          <Avatar size="xs" src="https://bit.ly/broken-link" />
          <Text fontSize="xx-small" ml="1">
            anonymous
          </Text>
          <Text whiteSpace="pre-line" fontSize="xx-small" color="gray.500" ml="1">
            {convertDateToString(item.createAt)}
          </Text>
          <Spacer />
          {isOwner && item.deny === undefined && (
            <Menu>
              <MenuButton
                width="24px"
                height="24px"
                as={IconButton}
                aria-label="Options"
                icon={<ExtraMenuIcon />}
                borderRadius="full"
                variant="link"
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
                    denyMessage();
                  }}
                >
                  Deny
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Box>
      <Box p="2">
        <Box borderRadius="md" borderWidth="1px" p="2">
          <Text whiteSpace="pre-line" fontSize="sm">
            {item.message}
          </Text>
        </Box>
        {locked === false && item.deny === undefined && (
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={2}
            width="full"
            bg="white"
            bottom="0"
            zIndex="overlay"
            padding="2"
            borderColor="gray.300"
          >
            <GridItem w="100%">
              <Button
                fontSize="xs"
                leftIcon={<ArrowUpIcon />}
                width="full"
                variant="ghost"
                height="4"
                color={item.voted ? 'gray.300' : 'black'}
                _hover={{ bg: 'white' }}
                _focus={{ bg: 'white' }}
                onClick={() => {
                  sendVote(true, item.voted);
                }}
              >
                추천해요
              </Button>
            </GridItem>
            <GridItem w="100%">
              <Button
                fontSize="xs"
                leftIcon={<ArrowDownIcon />}
                width="full"
                variant="ghost"
                height="4"
                color={item.voted ? 'gray.300' : 'black'}
                _hover={{ bg: 'white' }}
                _focus={{ bg: 'white' }}
                onClick={() => {
                  sendVote(false, item.voted);
                }}
              >
                다음에요
              </Button>
            </GridItem>
          </Grid>
        )}
        {locked === true && (
          <Box display="flex" alignItems="center" fontSize="xs" color="#F91880">
            <HeartIcon />
            {item.vote}
          </Box>
        )}
        <Box pt="2">
          <Divider />
          {item.deny === undefined && (
            <InstantMessageItemReplyInput
              uid={uid}
              instantEventId={instantEventId}
              messageId={item.id}
              locked={locked}
              onSendComplete={onSendComplete}
            />
          )}
        </Box>
        <Box>
          {item.reply &&
            item.reply.length > 0 &&
            item.reply.map((replyItem, idx) => (
              <Box pt="2">
                {idx === 0 && <Divider />}
                <InstantEventMessageReply
                  // eslint-disable-next-line react/no-array-index-key
                  key={`instant-event-msg-reply-${uid}-${instantEventId}-${item.id}-${idx}`}
                  replyItem={replyItem}
                />
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default InstantMessageItem;
