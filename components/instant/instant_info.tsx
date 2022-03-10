import {
  Avatar,
  Box,
  Center,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';
import ExtraMenuIcon from '../extra_menu_icon';
import { InMemberInfo } from '@/models/member/in_member_info';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';
import { useAuth } from '@/contexts/auth_user.context';

interface Props {
  userInfo: InMemberInfo;
  instantEventInfo: InInstantEvent;
  eventState: 'none' | 'locked' | 'closed' | 'question' | 'reply' | 'pre';
  onCompleteLockOrClose: () => void;
}

async function lockEvent({ uid, instantEventId }: { uid: string; instantEventId: string }) {
  try {
    await InstantMessageClientService.lock({
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
      message: '이벤트 잠금 실패',
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

const InstantInfo = function ({ userInfo, instantEventInfo, eventState, onCompleteLockOrClose }: Props) {
  const { authUser } = useAuth();
  const endDate = moment(instantEventInfo.endDate, moment.ISO_8601);
  const isOwner = authUser !== null && authUser.uid === userInfo.uid;
  return (
    <>
      {isOwner && (
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
                onClick={() => {
                  lockEvent({ uid: userInfo.uid, instantEventId: instantEventInfo.instantEventId })
                    .then(() => {
                      onCompleteLockOrClose();
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                }}
              >
                즉석 질문 이벤트 댓글잠금
              </MenuItem>
              <MenuItem
                bgColor="red.300"
                textColor="white"
                _hover={{ bg: 'red.500' }}
                _focus={{ bg: 'red.500' }}
                onClick={() => {
                  closeEvent({ uid: userInfo.uid, instantEventId: instantEventInfo.instantEventId })
                    .then(() => {
                      onCompleteLockOrClose();
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                }}
              >
                즉석 질문 이벤트 종료
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
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
