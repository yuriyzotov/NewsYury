import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NewsService } from '../../services/news.service';
import { NewsItem } from '../../models/news-item.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  news: NewsItem[] = [];
  selectedTicker: string = 'BTC';
  loading: boolean = false;
  error: string | null = null;
  showDesignReference: boolean = false;

  constructor(
    private newsService: NewsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadNews();
  }

  onTickerChange(ticker: string): void {
    this.selectedTicker = ticker;
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.error = null;

    this.newsService.getNews(this.selectedTicker)
      .subscribe({
        next: (news) => {
          this.news = news;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching news:', err);
          this.error = 'Failed to load news. Please try again later.';
          this.loading = false;
        }
      });
  }

  openNewsLink(url: string): void {
    window.open(url, '_blank');
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * Swaps the main image with a selected thumbnail image
   * @param item The news item
   * @param newMainImageUrl The URL of the image to be set as main
   */
  swapMainImage(item: NewsItem, newMainImageUrl: string): void {
    // Store the current main image URL
    const currentMainImageUrl = item.imageUrl;

    // If there's no current main image, just set the new one and return
    if (!currentMainImageUrl) {
      item.imageUrl = newMainImageUrl;
      return;
    }

    // Set the new main image
    item.imageUrl = newMainImageUrl;

    // Find the index of the new main image in additionalImages
    if (item.additionalImages) {
      const index = item.additionalImages.indexOf(newMainImageUrl);
      if (index !== -1) {
        // Replace it with the old main image
        item.additionalImages[index] = currentMainImageUrl;
      } else {
        // If not found (shouldn't happen), add the old main image to additionalImages
        if (!item.additionalImages) {
          item.additionalImages = [];
        }
        item.additionalImages.push(currentMainImageUrl);
      }
    }

    // Stop event propagation to prevent opening the news link
    event?.stopPropagation();
  }

  toggleDesignReference(): void {
    this.showDesignReference = !this.showDesignReference;
  }
}
