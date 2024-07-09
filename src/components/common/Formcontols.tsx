import React from 'react';
import { FormControl, RadioGroup, Radio, FormControlLabel, FormGroup, Checkbox, Input, TextField } from '@mui/material';

// answered is used when these components are rendered from userresponseformview component
export const MultipleChoiceQuestion: React.FC<any> = ({ question, options, onChange, answered }) => {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-required={question.required}
        aria-label={question.question}
        name={question._id}
        aria-disabled={!!answered}
        onChange={(e) => onChange(question, e.target.value)}
      >
        {options.map((option: any) => (
          <FormControlLabel
            key={option.option}
            checked={answered ? option.option == answered : undefined}
            value={option.option}
            control={<Radio color="success" />}
            label={option.option}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export const CheckboxQuestion: React.FC<any> = ({ question, options, onChange, answered }) => {
  const handleChange = (option: any) => (event: any) => {
    onChange(question, "", option._id, event.target.checked);
  };

  return (
    <FormControl component="fieldset">
      <FormGroup aria-required={question.required} aria-disabled={!!answered}>
        {options.map((option: any) => (
          <FormControlLabel
            key={option.option}
            checked={answered ? answered.includes(option._id) : undefined}
            control={<Checkbox color="success" />}
            label={option.option}
            onChange={handleChange(option)}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

export const ShortAnswerQuestion: React.FC<any> = ({ question, onChange, showQuestionPaper, answered }) => {
  return (
    <Input
      disabled={!!answered}
      color="success"
      fullWidth
      defaultValue={answered}
      onChange={(e) => onChange(question, e.target.value)}
      placeholder={showQuestionPaper ? "Your answer" : "Short test answer"}
      required={question.required}
    />
  );
}
export const DateQuestion: React.FC<any> = ({ question, onChange, answered }) => {
  return (
    <>
      <TextField
        disabled={!!answered}
        color="success"
        type="date"
        defaultValue={answered}
        onChange={(e) => onChange(question, e.target.value)}
        required={question.required}
      />
    </>
  );
}

export const TimeQuestion: React.FC<any> = ({ question, onChange, answered }) => {
  return (
    <>
      <TextField
        disabled={!!answered}
        color="success"
        type="time"
        defaultValue={answered}
        onChange={(e) => onChange(question, e.target.value)}
        required={question.required}
      />
    </>
  );
}
