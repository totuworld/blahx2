import { Text } from '@chakra-ui/react';
import './print_text.module.css';

interface Props {
  printText: string | string[];
}
const PrintText = function ({ printText }: Props) {
  return (
    <Text whiteSpace="pre-line" p="4" position="absolute" fontSize="32pt" fontFamily="Pretendard">
      {printText}
    </Text>
  );
};

export default PrintText;
