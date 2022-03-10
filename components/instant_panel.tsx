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
  Text,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useQuery } from 'react-query';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth_user.context';
import { InMemberInfo } from '@/models/member/in_member_info';
import 'antd/dist/antd.css';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';

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
    const resp = await InstantMessageClientService.create({ uid, title, desc, startDate, endDate });
    return {
      result: true,
      instantEventId: resp.payload?.instantEventId,
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

  const [eventList, setEventList] = useState<InInstantEvent[]>([]);

  const initialRef = useRef<any>();
  const isOwner = authUser !== null && authUser.uid === userInfo.uid;

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const tempStartDate = moment();
  const tempEndDate = moment(tempStartDate).add({ days: 1 });
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([tempStartDate, tempEndDate]);

  const afterTwoWeekMoment = moment().add(2, 'week');

  const queryKey = ['instantEventList', userInfo.uid];

  useQuery(
    queryKey,
    // eslint-disable-next-line no-return-await
    async () => await axios.get<InInstantEvent[]>(`/api/instant-event.list/${userInfo.uid}`),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data.status === 200 && data.data) {
          setEventList(data.data);
        }
      },
    },
  );

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
    if (resp.result === true && resp.instantEventId !== undefined) {
      // 해당 질문 목록으로 바로 진입 시킨다.
      window.location.href = `/${userInfo.screenName}/instant/${resp.instantEventId}`;
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
            즉석 질문 이벤트 생성
          </Button>
        )}
      </Box>
      {isOpen && (
        <Box borderWidth="1px" borderRadius="lg" p="2" bg="white">
          <FormControl isRequired>
            <FormLabel>이벤트 이름</FormLabel>
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
          <FormControl mt={4} isRequired>
            <FormLabel>질문 가능 날짜</FormLabel>
            <RangePicker
              size="large"
              value={dateRange}
              disabledDate={(current) => current < moment().endOf('day') || current > afterTwoWeekMoment}
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
        </Box>
      )}
      <Box spacing="12px" mt="6">
        {eventList.map((eventInfo) => (
          <Link
            key={`instantEventKey-${userInfo.uid}-${eventInfo.instantEventId}`}
            href={`/${userInfo.screenName}/instant/${eventInfo.instantEventId}`}
          >
            <Flex bg="white" p="2" alignItems="center" borderRadius="md">
              <Text>{eventInfo.title}</Text>
              <Spacer />
              <ArrowRightIcon />
            </Flex>
          </Link>
        ))}
      </Box>
      {eventList.length === 0 && (
        <Box mt="6">
          <img style={{ width: '50%', margin: '0 auto' }} src="/blahx2.svg" alt="hero" />
          <Flex justify="center">
            <Box mb="6" height="100vh" fontSize="sm">
              즉석 질문 이벤트가 없어요.
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default InstantPanel;
