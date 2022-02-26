import type { NextApiRequest, NextApiResponse } from 'next';
import playwright, { loadFont } from 'playwright-aws-lambda';
import { getBaseUrl } from '@/utils/get_base_url';

// https://ndo.dev/posts/link-screenshot
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Start Playwright with the dynamic chrome-aws-lambda args
  const browser = await playwright.launchChromium();

  const hostAndPort = getBaseUrl(true);

  await loadFont(`${hostAndPort}/woff2/Pretendard-Regular.woff2`);

  // Create a page with the recommended Open Graph image size
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 675,
    },
  });

  // Extract the url from the query parameter `path`
  const url = req.query.path as string;

  // Pass current color-scheme to headless chrome
  const colorScheme = req.query.colorScheme as 'light' | 'dark' | 'no-preference' | null;

  await page.emulateMedia({ colorScheme });

  await page.goto(url);

  const data = await page.screenshot({
    type: 'jpeg',
  });

  await browser.close();

  // Set the `s-maxage` property to cache at the CDN layer
  res.setHeader('Cache-Control', 's-maxage=31536000, public');
  res.setHeader('Content-Type', 'image/jpeg');
  res.end(data);
};
