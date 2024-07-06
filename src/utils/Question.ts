
import { Option, QUESTION_TYPES } from "./constants";
import { createRandomString, isSelectionType } from "./util";
import { ObjectId } from 'bson';

export class Question {
  public question: string;
  public questionType: QUESTION_TYPES;
  public answer: boolean;
  public required: boolean;
  public open: boolean;
  public options: Option[];
  public _id: string;
  public points: number;

  constructor(data?: Question) {
    this.question = data?.question || 'Question';
    this.options = data?.options || [{ option: "" }];
    this.questionType = data?.questionType as QUESTION_TYPES || QUESTION_TYPES.RADIO;
    this.open = data?.open == false ? false : true;
    this.required = data?.required || false;
    this.answer = data?.answer || false;
    this._id = data?._id || new ObjectId().toString();
    this.points = 4;
  }

  openAndCloseQuestion(value: boolean): Question {
    this.open = value;
    return this;
  }

  updateQuestion(question: string): Question {
    this.question = question;
    return this;
  }

  addNewOption(): Question {
    this.options.push({ option: "Option " + (this.options.length + 1) });
    return this;
  }

  removeOption(optionIndex: number): Question {
    this.options.splice(optionIndex, 1);
    return this;
  }

  updateOption(optionIndex: number, value: string): Question {
    this.options[optionIndex].option = value;
    return this;
  }

  updateQuestionType(type: string): Question {
    this.questionType = type as QUESTION_TYPES;
    if (!isSelectionType(type as QUESTION_TYPES)) {
      this.options = [];
    }
    return this;
  }

  copyQuestion(): Question {
    let copyQuestion = new Question(this);
    copyQuestion.options = [...this.options];
    copyQuestion._id = this._id.slice(0, this._id.length - 3) + createRandomString(3);
    copyQuestion.open = true;
    return copyQuestion;
  }

  updateRequiredType(): Question {
    this.required = !this.required;
    return this;
  }
}
