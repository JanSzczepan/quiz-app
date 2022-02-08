import express from 'express';

const app = express();
const port = 3000;

app.listen(port, () => {
   console.log(`Server is listening at http://localhost:3000/ Let's play the game :)`);
});