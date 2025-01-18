import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, NgZone} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MDCTextField} from '@material/textfield';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FormsModule} from '@angular/forms';
import {TextClassifier, FilesetResolver} from '@mediapipe/tasks-text';
import { Product, Role, Comment, Review, Constants } from '../../utils';
import {MatCardModule} from '@angular/material/card';
import { DataProviderService } from '../../services/data-provider.service';


@Component({
  selector: 'app-product-review',
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatProgressBarModule, MatCardModule, FormsModule],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css',
})


export class ProductReviewComponent{
  textClassifier: TextClassifier | null = null;
  isClassifierReady: boolean;
  commentsList: Comment[] = [];
  ratingScore: number = 0;
  isShowRatingScore: boolean = false;

  constructor(private dataProvider: DataProviderService, private ngZone: NgZone) {
    this.createTextClassifier();
    this.initQuestions();
    this.isClassifierReady = true;
  }

  private initQuestions() {
    this.commentsList = [];
    this.commentsList.push({question: 'How did the product meet your expectations in terms of quality and performance?', answer: ''});
    this.commentsList.push({question: 'How easy and intuitive was it to use the product?', answer: ''});
    this.commentsList.push({question: 'What do you think about the product\'s packaging and the delivery process?', answer: ''});
    this.commentsList.push({question: 'How would you describe the overall value of the product in relation to its price?', answer: ''});
    this.commentsList.push({question: 'How easy and intuitive was it to use the product?', answer: ''});
  }

  private async createTextClassifier() {
    const text = await FilesetResolver.forTextTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm"
    );

    this.textClassifier = await TextClassifier.createFromOptions(text, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/text_classifier/bert_classifier/float32/1/bert_classifier.tflite`
      },
      maxResults: 5
    });

    console.log('Classification model is ready: ', this.textClassifier);
  }


  onSubmitClick() {
    if (this.textClassifier == null || ! this.isClassifierReady) {
      console.error('Classifier unavailable.');
      return;
    }
    
    this.isClassifierReady = false;

    setTimeout(() => {
      if (this.textClassifier == null) {
        console.error('Classifier unavailable.');
        return;
      }

      let totalPositive = 0;
      let totalNegative = 0;

      for (let i = 0; i < this.commentsList.length; i++) {
        const comment = this.commentsList[i];
        if (comment.answer === '') { // consider empty answers as neutral
          totalPositive += 0.5;
          totalNegative += 0.5;
          continue;
        }
        let result = this.textClassifier.classify(comment.answer.trim());
        let categories = result.classifications[0].categories;

        console.log('>>>>> result ', i, ': ', categories[0].categoryName, ' = ', categories[0].score,
          ' ', categories[1].categoryName, ' = ', categories[1].score);

        let positive: number;
        let negative: number;
        if(categories[0].categoryName === 'positive') {
          positive = categories[0].score;
          negative = categories[1].score;
        } else {
          negative = categories[0].score;
          positive = categories[1].score;
        }

        // Amplify negative probability
        let factor = 2;
        negative = (negative * factor) / (negative * factor + positive);
        positive = 1 - negative;
        console.log('>>>>>> after penality: positive = ', positive, ', negative = ', negative);

        totalPositive += positive;
        totalNegative += negative;
      }

      totalPositive /= this.commentsList.length;
      totalNegative /= this.commentsList.length;

      let totalScore = totalPositive * Constants.SCORE_UPPER_BOUND; // a rating score out of 5 (upper bound)
      console.log('>>>>>> positive = ', totalPositive, ', negative = ', totalNegative, ', total score = ', totalScore)
      this.isShowRatingScore = true;
      this.ratingScore = totalScore;
      this.dataProvider.addProductReview(this.getCurrentProductId(), {comments: this.commentsList, score: totalScore});
      this.isClassifierReady = true;
      this.initQuestions();
    }, 100);
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getCurrentProductId(): number {
    return this.dataProvider.getCurrentProductId();
  }

  getCurrentProductName(): string {
    return this.dataProvider.getCurrentProductName();
  }

  getCurrentProductDescription(): string {
    return this.dataProvider.getCurrentProductDescription();
  }

  clearFields() {
    this.ratingScore = 0;
    this.isShowRatingScore = false;
    this.initQuestions();
  }

}
