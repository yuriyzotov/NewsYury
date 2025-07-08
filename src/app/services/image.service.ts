import { Injectable } from '@angular/core';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  // Stock images for different categories
  private readonly stockImages = {
    bullish: [
      'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80'
    ],
    bearish: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&q=80'
    ],
    crypto: [
      'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=400&q=80'
    ],
    tech: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&w=400&q=80'
    ],
    finance: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80'
    ],
    default: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80'
    ]
  };

  constructor(private categoryService: CategoryService) { }

  /**
   * Generates relevant images based on news content
   * @param title The news title
   * @param description The news description
   * @param ticker The ticker symbol
   * @returns An array of image URLs
   */
  generateImagesForNews(title: string, description: string, ticker: string): string[] {
    const images: string[] = [];

    // Determine the categories using the CategoryService
    const categories = this.categoryService.determineCategory(title, description, ticker);

    // Select 2-3 images total
    const numImages = Math.floor(Math.random() * 2) + 2; // 2 or 3 images

    // Create a pool of images from all categories
    let allCategoryImages: string[] = [];

    // Add images from each category to the pool
    categories.forEach(category => {
      if (this.stockImages[category as keyof typeof this.stockImages]) {
        allCategoryImages = allCategoryImages.concat(
          this.stockImages[category as keyof typeof this.stockImages]
        );
      }
    });

    // Remove duplicates from the pool
    allCategoryImages = [...new Set(allCategoryImages)];

    // Shuffle all category images to get random ones each time
    const shuffled = [...allCategoryImages].sort(() => 0.5 - Math.random());

    // Take the first numImages
    for (let i = 0; i < Math.min(numImages, shuffled.length); i++) {
      images.push(shuffled[i]);
    }

    // If we don't have enough images, add some from the default category
    if (images.length < numImages) {
      const defaultImages = this.stockImages.default.filter(img => !images.includes(img));
      const shuffledDefaults = [...defaultImages].sort(() => 0.5 - Math.random());

      for (let i = 0; i < numImages - images.length; i++) {
        if (i < shuffledDefaults.length) {
          images.push(shuffledDefaults[i]);
        }
      }
    }

    return images;
  }
}
