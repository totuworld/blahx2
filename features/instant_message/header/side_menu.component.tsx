import { Menu, MenuButton, MenuList, IconButton, MenuItem } from '@chakra-ui/react';
import ExtraMenuIcon from '@/components/extra_menu_icon';
import { InMemberInfo } from '@/models/member/in_member_info';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';

interface Props {
  eventState: 'none' | 'locked' | 'closed' | 'question' | 'reply' | 'pre';
  userInfo: InMemberInfo;
  instantEventInfo: InInstantEvent;
  onCompleteLockOrClose: () => void;
}

async function immediateCloseSendMessagePeriod({ uid, instantEventId }: { uid: string; instantEventId: string }) {
  try {
    await InstantMessageClientService.immediateClosSendMessagePeriod({
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
      message: '즉시 질문기간 종료 실패',
    };
  }
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

const InstantEventHeaderSideMenu = function ({ eventState, userInfo, instantEventInfo, onCompleteLockOrClose }: Props) {
  return (
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
        {eventState === 'question' && (
          <MenuItem
            onClick={() => {
              immediateCloseSendMessagePeriod({
                uid: userInfo.uid,
                instantEventId: instantEventInfo.instantEventId,
              })
                .then(() => {
                  onCompleteLockOrClose();
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
          >
            즉시 질문기간 종료
          </MenuItem>
        )}
        {eventState === 'reply' && (
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
        )}
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
  );
};

export default InstantEventHeaderSideMenu;
