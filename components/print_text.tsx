import { Text } from '@chakra-ui/react';
import './print_text.module.css';

interface Props {
  printText: string | string[];
}
const PrintText = function ({ printText }: Props) {
  const textCount = printText.length;
  const usedText = textCount > 200 ? `${(printText as string).substring(0, 199)}...(나머지는 링크로)` : printText;
  return (
    <Text whiteSpace="pre-line" p="4" position="absolute" fontSize="32pt" fontFamily="Pretendard">
      {usedText}
    </Text>
  );
};

export default PrintText;
