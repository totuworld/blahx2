import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { DatePicker } from 'antd';
import { Moment } from 'moment';
import { useAuth } from '@/contexts/auth_user.context';
import { InMemberInfo } from '@/models/member/in_member_info';
import 'antd/dist/antd.css';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';

const { RangePicker } = DatePicker;

interface Props {
  userInfo: InMemberInfo;
}

async function createEvent({
  uid,
  title,
  desc,
  startDate,
  endDate,
}: {
  uid: string;
  title: string;
  desc?: string;
  startDate?: string;
  endDate?: string;
}) {
  if (title.length <= 0) {
    return {
      result: false,
      message: '제목을 입력해주세요',
    };
  }
  try {
    await InstantMessageClientService.create({ uid, title, desc, startDate, endDate });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: '생성 실패',
    };
  }
}

const InstantPanel = function ({ userInfo }: Props) {
  const { authUser } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef<any>();
  const isOwner = authUser !== null && authUser.uid === userInfo.uid;

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);

  async function create() {
    const resp = await createEvent({
      uid: userInfo.uid,
      title,
      desc,
      startDate: dateRange[0] !== null ? dateRange[0].toISOString() : undefined,
      endDate: dateRange[1] !== null ? dateRange[1].toISOString() : undefined,
    });
    if (resp.result === false) {
      toast({
        title: '이벤트 생성 실패',
        position: 'top-right',
      });
    }
  }

  return (
    <>
      <Box>
        {isOwner && !isOpen && (
          <Button
            width="full"
            onClick={() => {
              onOpen();
            }}
          >
            질문 목록 생성
          </Button>
        )}
      </Box>
      {isOpen && (
        <>
          <FormControl isRequired>
            <FormLabel>질문 목록 이름</FormLabel>
            <Input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              ref={initialRef}
              placeholder="질문 목록 이름"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>설명</FormLabel>
            <Input
              onChange={(e) => {
                setDesc(e.target.value);
              }}
              placeholder="설명"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>질문 가능 날짜</FormLabel>
            <RangePicker
              size="large"
              value={dateRange}
              onChange={(v) => {
                if (v !== null) setDateRange(v);
              }}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </FormControl>
          <Flex>
            <Spacer />
            <ButtonGroup variant="outline" spacing="6" mt="2">
              <Button
                colorScheme="blue"
                onClick={() => {
                  create().then(() => {
                    // 닫기 해버린다.
                    onClose();
                    // query로 신규 데이터를 긁는다.
                  });
                }}
              >
                저장
              </Button>
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                닫기
              </Button>
            </ButtonGroup>
          </Flex>
        </>
      )}
    </>
  );
};

export default InstantPanel;
