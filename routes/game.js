import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

function gameRoutes(app) {
   //ważne dane rzekomo powinny być zapisywane na back-end
   let currentQuestion = 0;
   let goodAnswers = 0;
   let isFriendCalled = false;
   let isPublicQuestioned = false;
   let isFiftyFifty = false;
   //pobieramy pytania z pliku json
   let rawData = fs.readFileSync(path.join(__dirname, "/data/questions.json"));
   const answersArr = JSON.parse(rawData);
   const amountOfQuestions = answersArr.length;
   let isGameOver = false;

   //wysyłamy kolejne pytanie i przydatne informacje
   app.get("/question", (req, res) => {
      const resetValues = () => {
         currentQuestion = 0;
         goodAnswers = 0;
         isGameOver = false;
         //friendy itp. teź prolly na false
         isFriendCalled = false;
         isPublicQuestioned = false;
         isFiftyFifty = false;
      }

      if (currentQuestion === answersArr.length) {
         res.json({
            winner: true
         });
         resetValues();
      } else if(isGameOver) {
         res.json({
            loser: true,
            goodAnswers,
            amountOfQuestions
         })
         resetValues();
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
   app.post("/answer/:index", (req, res) => {
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

   app.get("/help/friend", (req, res) => {
      if(isFriendCalled) {
         return res.json({"text": "Zadzwoniłeś już do przyjaciela..."})
      }

      isFriendCalled = true;

      const friendAnswer = answersArr[currentQuestion].correctAnswer;

      res.json({friendAnswer});
   });
}

export default gameRoutes;