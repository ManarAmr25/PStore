import {Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MDCTextField } from '@material/textfield';
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

  constructor() {
    this.createTextClassifier();
    this.initQuestions();
  }

  ngOnInit(): void {
    console.log('>>>> in classifier component on init');
  }

  private initQuestions() {
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
  
    // Show demo section now model is ready to use.
    // demosSection.classList.remove("invisible");
    this.isClassifierReady = true;
    console.log('>>>> model obtained: ', this.textClassifier);
  }


  onSubmitClick() {
    console.log('>>>> start classification of comment...');
    if (this.textClassifier == null) {
      console.log('>>>> classifier unavailable');
      return;
    }

    let scores = [];
    for (let i = 0; i < this.commentsList.length; i++) {
      const comment: Comment = this.commentsList[i];
      let result = this.textClassifier.classify(comment.answer);
      let categories = result.classifications[0].categories;
      console.log('>>>>> result ', i, ': ', categories[0].categoryName, ' = ', categories[0].score,
        ' ', categories[1].categoryName, ' = ', categories[1].score);
    }
  }

}

interface Comment {
  question: string;
  answer: string;
}