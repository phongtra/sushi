import * as yup from 'yup';

export const passwordValidator = () => {
  return yup.object().shape({
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must have minimum length of 6')
      .matches(/[a-z]/, 'Password must contain a lowercase letter')
      .matches(/[A-Z]/, 'Password must contain an uppercase letter')
      .matches(/[0-9]/, 'Password must contain a number')
      .matches(/[!@#$%^&*()]/, 'Password must contain a special character')
  });
};
