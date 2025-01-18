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
    this.commentsList = this.dataProvider.generateEmptyReviewResponses();
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

    console.log('bert_classifier.tflite is ready: ', this.textClassifier);
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
      let weights = this.dataProvider.getReviewQuestionsWeights();

      for (let i = 0; i < this.commentsList.length; i++) {
        let positive: number;
        let negative: number;
        const comment = this.commentsList[i];
        console.log(`Question weight = ${weights[i]}`)

        if (comment.answer.trim() === '') { // consider empty answers as neutral
          positive = negative = 0.5;
        } else {
          let result = this.textClassifier.classify(comment.answer.trim());
          let categories = result.classifications[0].categories;
  
          if(categories[0].categoryName === 'positive') {
            positive = categories[0].score;
            negative = categories[1].score;
          } else {
            negative = categories[0].score;
            positive = categories[1].score;
          }

          console.log(`Scores of response #${i}: positive = ${positive}, negative = ${negative}`);
        }

        // Amplify negative probability
        let factor = 2;
        negative = (negative * factor) / (negative * factor + positive);
        positive = 1 - negative;
        console.log(`Scores after negative penality of response #${i}: positive = ${positive}, negative = ${negative}`);

        // multiply by the question weight
        positive *= weights[i];
        negative *= weights[i];
        console.log(`Scores after considering question weight of response #${i}: positive = ${positive}, negative = ${negative}`);

        totalPositive += positive;
        totalNegative += negative;
      }

      let weightsSum = weights.reduce((acc, val) => acc + val, 0)
      totalPositive /= weightsSum;
      totalNegative /= weightsSum;

      let totalScore = totalPositive * Constants.SCORE_UPPER_BOUND; // a rating score out of 5 (upper bound)
      console.log(`Total review score: total positive = ${totalPositive}, total negative = ${totalNegative}, total score = ${totalScore}/${Constants.SCORE_UPPER_BOUND}`);
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

  populateAnswers() {
    this.ratingScore = 0;
    this.isShowRatingScore = false;
    let answers = this.dataProvider.generateRandomReviewResponses();
    this.commentsList = answers;
    console.log('>>>>>> this.commentList after = ', this.commentsList)
  }

  clearFields() {
    this.ratingScore = 0;
    this.isShowRatingScore = false;
    this.initQuestions();
  }

}
