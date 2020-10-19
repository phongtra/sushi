import sgMail from '@sendgrid/mail';
import { sendGridKey } from '../keys';

export const sendEmail = (email: string, link: string) => {
  sgMail.setApiKey(sendGridKey);
  const msg = {
    to: email,
    from: 'hoang_phong98@me.com',
    subject: 'Reset your password',
    html: `
        <p>If you received this email, you have requested for a password reset. This is the link to reset password: </p>
        <p><a href="${link}">Click this link</a></p>
    `
  };
  sgMail.send(msg);
};
