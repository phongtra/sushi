import * as yup from 'yup';

export const userValidator = () => {
  return yup.object().shape({
    username: yup.string().required().min(4),
    email: yup.string().required().email(),
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
