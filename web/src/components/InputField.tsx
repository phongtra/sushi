import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea
} from '@chakra-ui/core';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder: string;
  textarea?: Boolean;
  important?: Boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  size: _,
  textarea = false,
  important = false,
  ...props
}) => {
  let InputOrTextarea = Input;
  if (textarea) {
    InputOrTextarea = Textarea;
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>
        {important ? <span style={{ color: 'red' }}>* </span> : ''}
        {props.label}
      </FormLabel>
      <InputOrTextarea
        {...props}
        {...field}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
