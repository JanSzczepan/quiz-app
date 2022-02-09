import express from 'express';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const app = express();
const port = 3000;

app.listen(port, () => {
   console.log(`Server is listening at http://localhost:3000/ Let's play the game :)`);
});

//wskazujemy miejsce, z którego chcemy dostarczać statyczne pliki (index.html itp.)
app.use(express.static(path.join(__dirname + '/public')));

//ważne dane rzekomo powinny być zapisywane na back-end
const goodAnswers = 0;
const isFriendCalled = false;
const isPublicQuestioned = false;
const isFiftyFifty = false;
//pobieramy pytania z pliku json
let rawData = fs.readFileSync(path.join(__dirname, '/data/questions.json'));
const answers = JSON.parse(rawData);

// app.get('/question', (req, res) => {
   //plan: prosimy na froncie (za pomocą fetcha pod adresem "/question") o dane (pierwsze pytanie i ogólna ilość pytań)
// })
