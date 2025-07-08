import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NewsItem } from '../models/news-item.model';
import { ImageService } from './image.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  // Using Google News RSS feed to get real news data
  private readonly GOOGLE_NEWS_URL = 'https://news.google.com/rss/search';

  constructor(
    private http: HttpClient,
    private imageService: ImageService,
    private categoryService: CategoryService
  ) { }

  getNews(ticker: string): Observable<NewsItem[]> {
    // Use a CORS proxy to access Google News RSS feed
    const proxyUrl = 'https://corsproxy.io/?';
    const encodedUrl = encodeURIComponent(`${this.GOOGLE_NEWS_URL}?q=${ticker}&hl=en-US&gl=US&ceid=US:en`);

    return this.http.get(proxyUrl + encodedUrl, { responseType: 'text' })
      .pipe(
        map(response => this.parseRssToNewsItems(response, ticker)),
        catchError(error => {
          console.error('Error fetching news:', error);
          // Fallback to mock data if the API call fails
          return of(this.getMockNewsData(ticker));
        })
      );
  }

  private parseRssToNewsItems(rssText: string, ticker: string): NewsItem[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rssText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    const newsItems: NewsItem[] = [];

    // Get the top 6 news items
    for (let i = 0; i < Math.min(items.length, 6); i++) {
      const item = items[i];
      const title = item.querySelector('title')?.textContent || `News about ${ticker}`;
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const source = item.querySelector('source')?.textContent || 'Google News';

      // Generate images based on the news content
      const images = this.imageService.generateImagesForNews(title, description, ticker);

      // Determine the categories
      const categories = this.categoryService.determineCategory(title, description, ticker);

      newsItems.push({
        id: (i + 1).toString(),
        title: title,
        description: description,
        url: link,
        source: source,
        publishedAt: pubDate ? new Date(pubDate) : new Date(),
        imageUrl: images[0], // Use the first image as the main image
        additionalImages: images.slice(1), // Store additional images if needed
        categories: categories // Set the categories
      });
    }

    return newsItems;
  }

  private getMockNewsData(ticker: string): NewsItem[] {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    const twoDaysAgo = new Date(currentDate);
    twoDaysAgo.setDate(currentDate.getDate() - 2);

    // Mock news data templates
    const mockNewsTemplates = [
      {
        id: '1',
        title: `${ticker} Price Analysis: Market Shows Bullish Trend`,
        description: `The ${ticker} market has shown a bullish trend in the last 24 hours with significant volume increase.`,
        url: 'https://www.google.com/search?q=' + ticker + '+news',
        source: 'Market Analysis',
        publishedAt: currentDate,
      },
      {
        id: '2',
        title: `Investors Optimistic About ${ticker} Future Growth`,
        description: `Analysts predict strong growth for ${ticker} in the coming months based on recent developments.`,
        url: 'https://www.google.com/search?q=' + ticker + '+investment+news',
        source: 'Investment News',
        publishedAt: yesterday,
      },
      {
        id: '3',
        title: `${ticker} Announces New Strategic Partnership`,
        description: `A new partnership has been announced that could significantly impact ${ticker}'s market position.`,
        url: 'https://www.google.com/search?q=' + ticker + '+partnership+news',
        source: 'Business Insider',
        publishedAt: twoDaysAgo,
      },
      {
        id: '4',
        title: `Technical Analysis: ${ticker} Support and Resistance Levels`,
        description: `Key support and resistance levels for ${ticker} have been identified by technical analysts.`,
        url: 'https://www.google.com/search?q=' + ticker + '+technical+analysis',
        source: 'Technical Review',
        publishedAt: yesterday,
      },
      {
        id: '5',
        title: `${ticker} Trading Volume Reaches New High`,
        description: `Trading volume for ${ticker} has reached a new high, indicating increased market interest.`,
        url: 'https://www.google.com/search?q=' + ticker + '+trading+volume',
        source: 'Market Watch',
        publishedAt: currentDate,
      }
    ];

    // Generate mock news with images
    const mockNews: NewsItem[] = mockNewsTemplates.map(template => {
      // Generate images based on the news content
      const images = this.imageService.generateImagesForNews(template.title, template.description, ticker);

      // Determine the categories
      const categories = this.categoryService.determineCategory(template.title, template.description, ticker);

      return {
        ...template,
        imageUrl: images[0], // Use the first image as the main image
        additionalImages: images.slice(1), // Store additional images if needed
        categories: categories // Set the categories
      };
    });

    return mockNews;
  }
}
