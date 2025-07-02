import { createServerFn } from '@tanstack/react-start';
import { dummyCodefetch } from '~/data/dummy-data';

export const scrapeUrl = createServerFn({ method: 'GET' })
  .validator((input: { url: string }) => input)
  .handler(async ({ data }) => {
    const { url } = data;

    // For now, return dummy data
    // In production, this would:
    // 1. Fetch the HTML from the URL
    // 2. Parse and extract relevant content
    // 3. Convert to the codefetch structure

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate different responses based on URL patterns
    if (url.includes('github.com')) {
      return {
        success: true,
        data: dummyCodefetch,
        metadata: {
          url,
          scrapedAt: new Date().toISOString(),
          title: 'GitHub Repository',
          description: 'Scraped content from GitHub repository',
        },
      };
    }

    if (url.includes('error')) {
      throw new Error('Failed to scrape URL: Invalid response from server');
    }

    // Default response with dummy data
    return {
      success: true,
      data: dummyCodefetch,
      metadata: {
        url,
        scrapedAt: new Date().toISOString(),
        title: 'Scraped Website',
        description: 'Successfully scraped website content',
      },
    };
  });
