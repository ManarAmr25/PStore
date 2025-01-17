import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MDCTextField} from '@material/textfield';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {TextClassifier, FilesetResolver} from '@mediapipe/tasks-text';


@Component({
  selector: 'app-product-review',
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css'
})


export class ProductReviewComponent implements OnInit{
  textClassifier: TextClassifier | null = null;
  isClassifierReady: boolean = false;
  commentsList: Comment[] = [];
  scores: number[] = [];

  @Input()
  product: Product | null = null;

  @Output()
  reviewSubmitted = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
    this.createTextClassifier();
    this.initQuestions();
  }

  private initQuestions() {
    this.commentsList = [];
    this.commentsList.push({question: 'Did this product meet your expectations?', answer: ''});
    this.commentsList.push({question: 'How does this product compare to others you\'ve used in the same category?', answer: ''});
    this.commentsList.push({question: 'What do you think about the product\'s packaging and the delivery process?', answer: ''});
    this.commentsList.push({question: 'In your opinion, does this product offer good value for the price you paid?', answer: ''});
    this.commentsList.push({question: 'Do you have any additional comments?', answer: ''});
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
  
    this.isClassifierReady = true;
    console.log('>>>> model obtained: ', this.textClassifier);
  }


  onSubmitClick() {
    if (this.textClassifier == null || ! this.isClassifierReady) {
      console.error('>>>>>> Classifier unavailable.');
      return;
    }
    
    this.isClassifierReady = false;

    setTimeout(() => {
      if (this.textClassifier == null) {
        console.log('>>>>> Error classifier ...');
        return;
      }

      let totalPositive = 0;
      let totalNegative = 0;

      for (let i = 0; i < this.commentsList.length; i++) {
        const comment = this.commentsList[i];
        let result = this.textClassifier.classify(comment.answer);
        let categories = result.classifications[0].categories;

        console.log('>>>>> result ', i, ': ', categories[0].categoryName, ' = ', categories[0].score,
          ' ', categories[1].categoryName, ' = ', categories[1].score);

        if(categories[0].categoryName === 'positive') {
          totalPositive += categories[0].score;
          totalNegative += categories[1].score;
        } else {
          totalNegative += categories[0].score;
          totalPositive += categories[1].score;
        }
      }

      let totalScore = Math.ceil(totalPositive / 20);
      this.scores.push(totalScore); //TODO: remove
      this.reviewSubmitted.emit({id: this.product?.id, score: totalScore});
      this.isClassifierReady = true;
      this.initQuestions();
    }, 100);
  }

  // computeClassifications(): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     console.log('>>>>> Starting asynchronous functionality...');
  //     setTimeout(() => {
  //       if (this.textClassifier == null) {
  //         console.log('>>>>> Error classifier ...');
  //         reject('Failure');
  //         return;
  //       }
  //       for (let i = 0; i < this.commentsList.length; i++) {
  //         const comment = this.commentsList[i];
  //         let result = this.textClassifier.classify(comment.answer);
  //         let categories = result.classifications[0].categories;
  //         console.log('>>>>> result ', i, ': ', categories[0].categoryName, ' = ', categories[0].score,
  //           ' ', categories[1].categoryName, ' = ', categories[1].score);
  //         if(categories[0].categoryName === 'positive') {
  //           comment.positive = categories[0].score;
  //           comment.negative = categories[1].score;
  //         } else {
  //           comment.negative = categories[0].score;
  //           comment.positive = categories[1].score;
  //         }
  //       }
  //       this.computeTotalScore();
  //       resolve('Success');
  //     }, 500);
  //   });
  // }

}

interface Comment {
  question: string;
  answer: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
}