import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor() { }

  /**
   * Determines the categories of a news item based on its content
   * @param title The news title
   * @param description The news description
   * @param ticker The ticker symbol
   * @returns An array of categories for the news item
   */
  determineCategory(title: string, description: string, ticker: string): string[] {
    const combinedText = (title + ' ' + description).toLowerCase();
    const categories: string[] = [];

    // Always add finance as a base category
    categories.push('finance');

    // Check for crypto-related keywords
    if (ticker === 'BTC' || ticker === 'ETH' || 
        combinedText.includes('bitcoin') || combinedText.includes('ethereum') || 
        combinedText.includes('crypto') || combinedText.includes('blockchain')) {
      categories.push('crypto');
    } 

    // Check for tech-related keywords
    if (ticker === 'AAPL' || ticker === 'MSFT' || ticker === 'GOOGL' || ticker === 'AMZN' ||
        combinedText.includes('technology') || combinedText.includes('software') || 
        combinedText.includes('hardware') || combinedText.includes('app')) {
      categories.push('tech');
    }

    // Check for bullish sentiment
    if (combinedText.includes('bullish') || combinedText.includes('growth') ||
        combinedText.includes('increase') || combinedText.includes('up') || 
        combinedText.includes('positive') || combinedText.includes('gain')) {
      categories.push('bullish');
    }

    // Check for bearish sentiment
    if (combinedText.includes('bearish') || combinedText.includes('decline') ||
        combinedText.includes('decrease') || combinedText.includes('down') || 
        combinedText.includes('negative') || combinedText.includes('loss')) {
      categories.push('bearish');
    }

    return categories;
  }
}
