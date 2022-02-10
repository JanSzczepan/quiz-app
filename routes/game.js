import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

function gameRoutes(app) {
   //ważne dane rzekomo powinny być zapisywane na back-end
   let currentQuestion = 0;
   let goodAnswers = 0;
   const isFriendCalled = false;
   const isPublicQuestioned = false;
   const isFiftyFifty = false;
   //pobieramy pytania z pliku json
   let rawData = fs.readFileSync(path.join(__dirname, "/data/questions.json"));
   const answersArr = JSON.parse(rawData);
   const amountOfQuestions = answersArr.length;
   let isGameOver = false;

   //wysyłamy kolejne pytanie i przydatne informacje
   app.get("/question", (req, res) => {
      if (currentQuestion === answersArr.length) {
         res.json({
            winner: true
         });
      } else if(isGameOver) {
         res.json({
            loser: true
         })
      } else {
         const nextQuestion = answersArr[currentQuestion];
         const {question, answers} = nextQuestion;

         res.json({
            question,
            answers,
            currentQuestion,
            amountOfQuestions,
         });
      }
   });

   //odbieramy informację o indeksie odpowiedzi użytkownika i zwracamy informację o jej poprawności (true albo false)
   app.post('/answer/:index', (req, res) => {
      if(isGameOver) {
         res.json({
            loser: true
         })
      }

      const {index} = req.params;
      const question = answersArr[currentQuestion];

      const isAnswerCorrect = question.correctAnswer === Number(index);

      if(isAnswerCorrect) {
         currentQuestion++;
         goodAnswers++;
      } else {
         isGameOver = true;
      }

      res.json({
         isAnswerCorrect
      })
   });
}

export default gameRoutes;