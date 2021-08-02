import { Component, OnInit } from '@angular/core';
import { myQuestions } from '../questions'
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  public currentSlide:any = 0;
  public prevBtn:boolean = true;
  public nextBtn:boolean = true;
  public submitBtn:boolean = true;
  public isActive:boolean = true;
  // variable to store the HTML output
  public output:any = [];
  // variable to store the response
  public response:any = [];
  public surveyCompleted:boolean = false;
  public errorMessage:boolean = false;
  public errorMessageTxt:string = '';

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.buildQuiz();
    // Show the first slide
    this.showSlide(this.currentSlide);
  }
  
  //Function to show next question
  showNextSlide() {
    if(!this.output[this.currentSlide].selectedAnswer.length){
      this.errorMessage = true;
      this.errorMessageTxt = "Please select your answer";
    } else {
      this.showSlide(this.currentSlide + 1);
    }
  }

  //Function to show previous question
  showPreviousSlide() {
    this.showSlide(this.currentSlide - 1);
  }

  //Function to show each question
  showSlide(n:any) {
    if(this.localStorageService.getItem('surveyOutput')) {
      this.surveyCompleted = true;
      this.output = this.localStorageService.getItem('surveyOutput');
      this.output = JSON.parse(this.output);
    }
    this.output.forEach((element:any) => {
      element.isActive = false;
    });
    this.output[n].isActive = true;
    this.currentSlide = n;
    if(this.currentSlide === 0){
      this.prevBtn = false;
    }
    else{
      this.prevBtn = true;
    }
    if(this.currentSlide === this.output.length-1){
      this.nextBtn = false;
      this.submitBtn = true;
    }
    else{
      this.nextBtn = true;
      this.submitBtn = false;
    }
  }

  showResults(){
    if(!this.errorMessage){
      if(!this.output[this.currentSlide].selectedAnswer.length){
        this.errorMessage = true;
        this.errorMessageTxt = "Please enter your answer";
      } else {
        this.localStorageService.setItem('surveyOutput', JSON.stringify(this.output));
        this.surveyCompleted = true;
        console.log(JSON.stringify(this.output));
      }
    } 
  }

  buildQuiz(){
    // for each question...
    myQuestions.forEach(
      (currentQuestion:any, questionNumber:any) => {
  
        // variable to store the list of possible answers
        const answers = [];
        // and for each available answer...
        
        if(currentQuestion.answers) {
          for(let letter in currentQuestion.answers){
            if(currentQuestion.inputType === 'checkbox') {
              answers.push({'answer': currentQuestion.answers[letter], 'value': letter, 'name': 'qtn' + questionNumber, isChecked: false});
            } else {
              answers.push({'answer': currentQuestion.answers[letter], 'value': letter, 'name': 'qtn' + questionNumber});
            }
            
          }
        }
        // add this question and its answers to the output
        this.output.push({'question':currentQuestion.question, 'answers':answers, 'inputType': currentQuestion.inputType, 'selectedAnswer': []});
      }
    );
  }

  onAnswerSelected(event:any, idx:number) {
    let selectedVal = event.target.value;
    if(this.output[this.currentSlide].inputType === 'textarea') {
      if(selectedVal.length < 5) {
        this.errorMessage = true;
        this.errorMessageTxt = "Your answer should be atleast 5 characters";
      } else {
        this.output[idx].selectedAnswer.push(selectedVal);
        this.errorMessage = false;
      }
    } else if(this.output[this.currentSlide].inputType === 'checkbox') {
      this.errorMessage = false;
      this.output[idx].answers.forEach((element:any) => {
        if(element.value === selectedVal){
          if(element.isChecked) {
            element.isChecked = false;
            this.output[idx].selectedAnswer.pop(element.answer);
          } else {
            element.isChecked = true;
            this.output[idx].selectedAnswer.push(element.answer);
          }
          this.output[idx+1].question = myQuestions[idx+1].question;
          this.output[idx+1].question = this.output[idx+1].question.replace('this animal', this.output[idx].selectedAnswer.join(', '));
        }
      });
    } else if(this.output[this.currentSlide].inputType === 'radio') {
      this.errorMessage = false;
      this.output[idx].selectedAnswer = [];
      this.output[idx].selectedAnswer.push(myQuestions[idx].answers[selectedVal]);
    }
  }

  startOver() {
    this.localStorageService.clear();
    this.surveyCompleted = false;
    this.currentSlide = 0;
    this.output = [];
    this.buildQuiz();
    this.showSlide(this.currentSlide);
  }
}