import { Box, Button, Center } from '@chakra-ui/react';

interface Props {
  isStart: boolean;
  onClickLogin: () => void;
}

const GoogleLoginButton = function ({ isStart, onClickLogin }: Props) {
  return (
    <>
      <Box width="full" pb="10" display={{ md: 'block', base: 'none' }}>
        <Center>
          <Button
            size="lg"
            mx="6"
            borderRadius="full"
            leftIcon={<img src="/google.svg" alt="google logo" style={{ backgroundColor: 'white', padding: '8px' }} />}
            bgColor="#4285F4"
            colorScheme="blue"
            color="white"
            onClick={onClickLogin}
          >
            Google 계정으로 {isStart ? '시작하기' : '로그인하기'}
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
            leftIcon={<img src="/google.svg" alt="google logo" style={{ backgroundColor: 'white', padding: '8px' }} />}
            bgColor="#4285F4"
            colorScheme="blue"
            color="white"
            onClick={onClickLogin}
          >
            Google 계정으로 {isStart ? '시작하기' : '로그인하기'}
          </Button>
        </Center>
      </Box>
    </>
  );
};

export default GoogleLoginButton;
