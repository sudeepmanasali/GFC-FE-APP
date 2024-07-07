import React from 'react';
import { FormControl, RadioGroup, Radio, FormControlLabel, FormGroup, Checkbox, Input, TextField } from '@mui/material';

export const MultipleChoiceQuestion: React.FC<any> = ({ question, options, onChange }) => {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-required={question.required}
        aria-label={question.question}
        name={question}
        onChange={(e) => onChange(question, e.target.value)}
      >
        {options.map((option: any) => (
          <FormControlLabel
            key={option.option}
            value={option.option}
            control={<Radio />}
            label={option.option}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export const CheckboxQuestion: React.FC<any> = ({ question, options, onChange }) => {
  const handleChange = (option: any) => (event: any) => {
    onChange(question, "", option._id, event.target.checked);
  };

  return (
    <FormControl component="fieldset">
      <FormGroup aria-required={question.required}>
        {options.map((option: any) => (
          <FormControlLabel
            key={option.option}
            control={<Checkbox />}
            label={option.option}
            onChange={handleChange(option)}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

export const ShortAnswerQuestion: React.FC<any> = ({ question, onChange, showQuestionPaper }) => {
  return (
    <Input
      fullWidth
      onChange={(e) => onChange(question, e.target.value)}
      placeholder={showQuestionPaper ? "Your answer" : "Short test answer"}
      required={question.required}
    />
  );
}
export const DateQuestion: React.FC<any> = ({ question, onChange }) => {
  return (
    <>
      <TextField
        type="date"
        onChange={(e) => onChange(question, e.target.value)}
        required={question.required}
      />
    </>
  );
}

export const TimeQuestion: React.FC<any> = ({ question, onChange }) => {
  return (
    <>
      <TextField
        type="time"
        onChange={(e) => onChange(question, e.target.value)}
        required={question.required}
      />
    </>
  );
}
