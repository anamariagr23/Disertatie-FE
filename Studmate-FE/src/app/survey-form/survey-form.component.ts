import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit {
  surveyForm!: FormGroup;
  surveyData: Survey = {
    "survey_id": 1,
    "title": "survey title",
    "questions": [
      {
        "question_id": 1,
        "choices": [
          {
            "choice_id": 1,
            "description": "text of the choice"
          }, {
            "choice_id": 2,
            "description": "cuinel"
          }
        ],
        "multiple_choice": true,
        "description": "text of question"
      },
      {
        "question_id": 2,
        "choices": [
          {
            "choice_id": 3,
            "description": "text of the choice"
          }, {
            "choice_id": 4,
            "description": "cuinel"
          }
        ],
        "multiple_choice": false,
        "description": "text of question"
      }
    ]
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.surveyForm = this.formBuilder.group({
      questions: this.formBuilder.array([])
    });
    this.loadSurvey();
  }

  loadSurvey(): void {
    this.surveyData.questions.forEach(question => {
      const questionGroup = this.formBuilder.group({
        question_id: question.question_id,
        responses: this.buildResponses(question)
      });
      this.questions.push(questionGroup);
    });
  }

  buildResponses(question: Question): FormGroup {
    const group: Record<number, FormControl> = {};
    question.choices.forEach((choice, index) => {
      group[choice.choice_id] = this.formBuilder.control('');
    });
    return this.formBuilder.group(group);
  }


  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }
}
