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

   //zwracamy informację o odpowiedzi udzielonej przez przyjaciela
   app.get("/help/friend", (req, res) => {
      if(isFriendCalled) {
         return res.json({"text": "Zadzwoniłeś już do przyjaciela..."})
      }

      isFriendCalled = true;

      const question = answersArr[currentQuestion];
      const friendAnswer = question.correctAnswer;

      res.json({friendAnswer});
   });

   //zwracamy informację o odpowiedzi udzielonej przez publiczność
   app.get("/help/public", (req, res) => {
      if(isPublicQuestioned) {
         return res.json({"text": "Zapytałeś już publiczności..."})
      }
      isPublicQuestioned = true;

      let votes = [];
      const a = 10;
      const n = answersArr[currentQuestion].answers.length;

      if(n > 1) {
         const r = (2 * 100) / ((n - 1) * n) - (2 * a) / (n - 1);
         
         for(let i = 0; i < n; i++) {
            votes.push(Math.round(a + i * r));
         }
      } else if(n === 1) {
         votes.push(100);
      }

      for(let i = votes.length - 1; i > 0; i--) {
         const number = Math.floor(Math.random() * 20 - 10);

         votes[i] += number;
         votes[i - 1] -= number;
      }

      const question = answersArr[currentQuestion];
      const {correctAnswer} = question;
  
      [votes[n - 1], votes[correctAnswer]] = [votes[correctAnswer], votes[n - 1]]; 

      res.json({votes});
   });

   //zwracamy informację o odpowiedzi fifty-fifty
   app.get("/help/fifty", (req, res) => {
      if(isFiftyFifty) {
         return res.json({"text": "Wykorzystałeś już szansę fifty-fifty..."})
      }

      isFiftyFifty = true;

      const question = answersArr[currentQuestion];

      const fiftyAnswer = [question.correctAnswer];

      while(fiftyAnswer.length < 2) {
         const number = Math.floor(Math.random() * question.answers.length);

         if(number !== question.correctAnswer) {
            fiftyAnswer.push(number)
         }
      }

      res.json({fiftyAnswer});
   });
}

export default gameRoutes;