import { useState } from 'react';
import Image from 'next/image';

type Props = {
  url: string;
  text: string;
};

const ScreenshotLink = function ({ url, text }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const [linkScreenshot, setLinkScreenshot] = useState('');

  const fetchImage = async (fetchUrl: string) => {
    let colorScheme: 'light' | 'dark' = 'light';
    if (typeof document !== 'undefined') {
      colorScheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    try {
      const res = await fetch(`/api/image?path=${encodeURIComponent(fetchUrl)}&colorScheme=${colorScheme}`);
      const image = await res.blob();
      setLinkScreenshot(URL.createObjectURL(image));
      setIsHovering(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div className="relative inline-block" onMouseOver={() => fetchImage(url)} onMouseOut={() => setIsHovering(false)}>
      {isHovering && linkScreenshot && (
        <div className="absolute z-10 block w-32 pointer-events-none right-1/2 lg:block bottom-[2.0rem] animate-fade_in_up">
          <Image src={linkScreenshot} height={180} width={300} unoptimized alt={text} className="rounded-sm" />
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-all border-underline-grow dark:ring-palevioletred"
      >
        {text}
      </a>
    </div>
  );
};

export default ScreenshotLink;
