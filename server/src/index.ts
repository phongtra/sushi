import express, { Response } from 'express';

const app = express();

app.get('/', (_req, res: Response) => {
  res.send({ hello: 'there' });
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
