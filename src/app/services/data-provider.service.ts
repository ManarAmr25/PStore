import { Injectable } from '@angular/core';
import { Product, Review, Comment } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  private reviewQuestions: string[] = [];
  private reviewQuestionsWeights: number[] = [];
  private sampleReviewAnswers: string[][] =[];

  private currentProduct: Product | null = null;
  private reviews = new Map<number, Review[]>;

  constructor() {
    this.initCommentsPopulationData();
  }

  addProductReview(id: number, review: Review) {
    if(this.reviews.has(id)) {
      let productReviews = this.reviews.get(id);
      if (productReviews != null) {
        productReviews.push(review);
        return;
      }
    }

    this.reviews.set(id, [review]);
  }

  getProductReviews(id: number) {
    if(this.reviews.has(id)) {
      return this.reviews.get(id);
    }
    return [];
  }

  setCurrentProduct(product: Product | null) {
    this.currentProduct = product;
  }

  getCurrentProduct(): Product | null {
    return this.currentProduct;
  }

  getCurrentProductId(): number {
    return this.currentProduct == null ? -1 : this.currentProduct.id;
  }

  getCurrentProductName(): string {
    return this.currentProduct == null ? '' : this.currentProduct.name;
  }

  getCurrentProductDescription(): string {
    return this.currentProduct == null ? '' : this.currentProduct.description;
  }

  getCurrentProductReviews(): Review[] {
    if(this.currentProduct != null && this.reviews.has(this.currentProduct.id)) {
      let currentList = this.reviews.get(this.currentProduct.id);
      if (currentList != null) {
        return currentList;
      }
    }
    return [];
  }

  computeCurrentProductAverageRating() {
    let sumScores: number = 0;
    let currentProductReviews = this.getCurrentProductReviews();
    if (currentProductReviews != null && currentProductReviews.length > 0) {
      currentProductReviews.forEach((review) => {
        sumScores += review.score;
      })
      sumScores /= currentProductReviews.length;
    }

    return sumScores;
  }

  computeProductsAverageRatings() {
    let ratingsMap = new Map<number, number>();

    this.reviews.forEach((reviews, key) => {
      let sum = 0;
      reviews.forEach((review) => {
        sum += review.score;
      });
      sum /= reviews.length;
      ratingsMap.set(key, sum);
    });

    return ratingsMap;
  }

  generateEmptyReviewResponses() {
    let commentsList: Comment[] = [];
    this.reviewQuestions.forEach((question) => {
      commentsList.push({question: question, answer: ''});
    });
    return commentsList;
  }

  generateRandomReviewResponses() {
    let commentsList: Comment[] = [];
    for(let i = 0; i < this.reviewQuestions.length; i++) {
      commentsList.push({question: this.reviewQuestions[i], answer: this.getRandomAnswer(this.sampleReviewAnswers[i])});
    }
    return commentsList;
  }

  getReviewQuestionsWeights() {
    return this.reviewQuestionsWeights;
  }

  private getRandomAnswer(answers: string[]): string {
    const index = Math.floor(Math.random() * answers.length);
    return answers[index];
  }

  private normalizeList(list: number[]) {
    const sum = list.reduce((acc, val) => acc + val, 0);
    list.map((num) => {return num/sum});
    list.forEach((value, index, array) => {
      array[index] = value / sum;
    });
  }

  private initCommentsPopulationData() {
    this.reviewQuestions = ['How did the product meet your expectations in terms of quality and performance?',
                            'How easy and intuitive was it to use the product?',
                            'What do you think about the product\'s packaging and the delivery process?',
                            'How would you describe the overall value of the product in relation to its price?',
                            'Would you recommend this product to others?'
                           ];

    this.reviewQuestionsWeights = [1, 1, 1, 1, 2];

    const qualityAnswers = ['The product exceeded my expectations in both quality and performance. It\'s very reliable.',
                            'It met my expectations but didn\'t really stand out in terms of performance.',
                            'I was disappointed with the product\'s quality. It didn\'t perform as advertised.',
                            'Quality was great, but the performance didn\'t quite live up to what I expected.',
                            'The product performed better than I thought, and the quality is top-notch.',
                            'It was exactly what I expected—no surprises in quality or performance.',
                            'The product underperformed in comparison to my expectations. I expected better build quality.',
                            'The quality was decent, but the performance was outstanding, especially for the price.',
                            'The product\'s performance was great, but I noticed some quality issues after a few uses.',
                            'It was mediocre—quality was okay, but performance didn\'t impress me much.'
                           ];

    const usabilityAnswers = ['The product was very easy to use, with intuitive controls and simple setup.',
                              'I found it a bit difficult at first, but once I figured it out, it was easy to use.',
                              'Very intuitive; I didn\'t need the manual to figure it out.',
                              'It took some time to get used to, but it became easier after a while.',
                              'The user interface was a bit confusing, but overall, it was still manageable.',
                              'It was quite easy to use, with a very user-friendly design.',
                              'The setup was straightforward, and I had no problems using it right away.',
                              'I had to read the instructions first, but after that, it was easy to operate.',
                              'The product was easy to use but could have had a few more features to enhance usability.',
                              'I had some trouble understanding how it works at first, but once I got the hang of it, it was smooth.'
                             ];

    const packagingAnswers = ['The packaging was secure, and the delivery was fast—arrived right on time.',
                              'The packaging was a bit excessive, but everything arrived intact and on schedule.',
                              'The delivery was delayed, but the packaging was adequate and protected the product well.',
                              'I was impressed with the neat packaging, and the product arrived quickly.',
                              'The packaging was sturdy, but the delivery was slower than expected.',
                              'Packaging could be improved, but the product still arrived in good condition.',
                              'The product was well-packaged and arrived earlier than expected.',
                              'The delivery was perfect, but the packaging could have been a bit more eco-friendly.',
                              'The product was packaged well, and the delivery process was flawless.',
                              'I had a small issue with the packaging being damaged, but the product was fine.'
                             ];

    const valueAnswers = ['It\'s a great value for the price—definitely worth every penny.',
                          'The product is decent, but I feel like I paid a bit more than it\'s worth.',
                          'Excellent value for the price, especially considering the quality and performance.',
                          'The product\'s price is reasonable given its features, but I expected a bit more.',
                          'I think it\'s overpriced for what it offers, although the quality is good.',
                          'For the price, it\'s an outstanding deal. I\'m very satisfied with the value.',
                          'The product offers good value for the price, but there are better options out there.',
                          'The value is average—nothing exceptional, but still reasonable for the price.',
                          'The product is fairly priced considering the quality, though I\'ve seen similar products for less.',
                          'It\'s a little pricey, but the performance justifies the cost.'
                         ];

    const recommendationAnswers = ['No.',
                                   'Yes.',
                                   'Absolutely, I think it\'s a great product and worth recommending to friends and family.',
                                   'I would recommend it with some reservations—it\'s great, but not perfect.',
                                   'Only to people who don\'t mind paying a bit extra for a reliable product.',
                                   'I wouldn\'t hesitate to recommend it; it exceeded my expectations in every way.',
                                   'I might recommend it, but it really depends on what someone is looking for.',
                                   'Yes, it\'s a solid product, and I think most people would find it very useful.',
                                   'I wouldn\'t recommend it; it didn\'t perform as well as I had hoped.',
                                   'I would, but I\'d also suggest they look at similar products in the same price range.'
                                  ];

    this.sampleReviewAnswers = [qualityAnswers, usabilityAnswers, packagingAnswers, valueAnswers, recommendationAnswers];
  }

}
