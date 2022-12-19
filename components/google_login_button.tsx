import { Box, Button, Center } from '@chakra-ui/react';

interface Props {
  onClick: () => void;
}

const GoogleLoginButton = function ({ onClick }: Props) {
  return (
    <Box width="full">
      <Center mt="20">
        <Button
          size="lg"
          margin="6"
          maxW="md"
          borderRadius="full"
          bgColor="#4285f4"
          color="white"
          colorScheme="blue"
          leftIcon={
            <img
              src="./google.svg"
              alt="구글 로고"
              style={{ backgroundColor: 'white', padding: '8px', borderRadius: '100%' }}
            />
          }
          onClick={onClick}
        >
          Google 계정으로 시작하기
        </Button>
      </Center>
    </Box>
  );
};

export default GoogleLoginButton;
