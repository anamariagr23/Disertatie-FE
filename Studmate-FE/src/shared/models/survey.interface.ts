interface Choice {
  choice_id: number;
  description: string;
}
interface Question {
  question_id: number;
  choices: Choice[];
  multiple_choice: boolean;
  description: string;
}
interface Survey {
  survey_id: number;
  title: string;
  questions: Question[];
}
