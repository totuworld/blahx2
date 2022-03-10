import { Box, Button, Center } from '@chakra-ui/react';
import { FaTwitter } from 'react-icons/fa';

interface Props {
  isStart: boolean;
  onClickLogin: () => void;
}

const TwitterLoginButton = function ({ isStart, onClickLogin }: Props) {
  return (
    <>
      <Box width="full" pb="10" display={{ md: 'block', base: 'none' }}>
        <Center>
          <Button
            size="lg"
            mx="6"
            borderRadius="full"
            leftIcon={<FaTwitter />}
            colorScheme="twitter"
            onClick={onClickLogin}
          >
            Twitter 계정으로 {isStart ? '시작하기' : '로그인하기'}
          </Button>
        </Center>
      </Box>
      <Box position="fixed" width="full" bottom="10" pb="10" display={{ md: 'none' }}>
        <Center>
          <Button
            size="lg"
            width="full"
            mx="6"
            borderRadius="full"
            leftIcon={<FaTwitter />}
            colorScheme="twitter"
            onClick={onClickLogin}
          >
            Twitter 계정으로 {isStart ? '시작하기' : '로그인하기'}
          </Button>
        </Center>
      </Box>
    </>
  );
};

export default TwitterLoginButton;
