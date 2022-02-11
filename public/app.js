const gameQuiz = document.querySelector('.quiz--game');
const winQuiz = document.querySelector('.quiz--win');
const lostQuiz = document.querySelector('.quiz--lose');
const questionNumberEl = document.querySelector('.quiz__question-number');
const questionEl = document.querySelector('.quiz__question-text');
const answerEls = [...document.querySelectorAll('.quiz__answer-text')];
const answerBoxEls = [...document.querySelectorAll('.quiz__answer-item')];
const answerIconEls = [...document.querySelectorAll('.quiz__aswer-icon')];
const submitBtn = document.querySelector('.quiz__aswer-submit');
const lostNumberEl = document.querySelector('.quiz--lose .quiz__text-span');
const resetBtns = [...document.querySelectorAll('.quiz--lose .quiz__btn, .quiz--win .quiz__btn')];

//fajny getterek i setterek
let activeAnswer = {
   index: null,
   get indexValue() {
      return this.index;
   },
   set indexValue(value) {
      this.index = value;
   }
};

//funckaj, która zdejmuje style z zaznaczonych odpowiedzi
const removeAnswerBoxElsStyle = () => {
   const activeClass = 'quiz__answer-item--active';
   const activeIcon = 'fa-dot-circle';
   const icon = 'fa-circle';

   answerBoxEls.forEach((boxEl, index) => {
      if(boxEl.classList.contains(activeClass)) {
         boxEl.classList.remove(activeClass);
      }
      if(answerIconEls[index].classList.contains(activeIcon)) {
         answerIconEls[index].classList.remove(activeIcon);
         answerIconEls[index].classList.add(icon);
      }
   })
}

//funkcja, która dodaje klasę do klikniętego pytania i aktualizuje zmienną activeAnswer
const styleClickedAnswer = () => {
   answerBoxEls.forEach((answerBoxEl, index) => {
      answerBoxEl.addEventListener('click', () => {
         const activeClass = 'quiz__answer-item--active';
         const activeIcon = 'fa-dot-circle';
         const icon = 'fa-circle';
         
         removeAnswerBoxElsStyle();

         answerBoxEl.classList.add(activeClass);
         answerIconEls[index].classList.remove(icon);
         answerIconEls[index].classList.add(activeIcon);

         //aktualizuje zmienną activeAnswer.index
         activeAnswer.indexValue = index;
      })
   })
}

//funkcja, która przekazuje dane do elemento DOM
const fillElements = (data) => {
   questionNumberEl.textContent = `Question ${data.currentQuestion + 1}/${data.amountOfQuestions}`;
   questionEl.textContent = data.question;
   answerEls.forEach((answerEl, index) => {
      answerEl.textContent = data.answers[index];
   });
}

//funkcja, która obsługuje zdarzenia po wygranej
const handleWinner = (data) => {
   gameQuiz.style.display = 'none';
   winQuiz.style.display = 'flex';
}

//funkcja, która obsługuje zdarzenia po przegranej
const handleLoser = (data) => {
   gameQuiz.style.display = 'none';

   lostNumberEl.textContent = `${data.goodAnswers}/${data.amountOfQuestions}`
   lostQuiz.style.display = 'flex';
}

//funkcja, która strzela do serwera prosząc o question, aswers data oraz info o ewentualnej wygranej lub przegranej
const showNextQuestion = () => {
   fetch('/question', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
         console.log(data);
         if(data.winner === true)
            handleWinner(data);
         else if(data.loser === true)
            handleLoser(data);
         else
            fillElements(data)
      })
}

//funkcja, która obsługuje zdarzenia po otrzymaniu odpowiedzi od serwera
const handleAnswerFedback = (data) => {
   showNextQuestion();
}

//funkcja, która wysyła zaznaczony indeks odpowiedzi użytkownika do serwera
const sendAnswer = (answerIndex) => {
   fetch(`/answer/${answerIndex}`, {method: 'POST'})
      .then(response => response.json())
      .then(data => handleAnswerFedback(data))
}

//funkcja, która odpowiada za zdarzenia po naciśnięciu submit btn
const handleSumbitBtn = () => {
   submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      removeAnswerBoxElsStyle();
      sendAnswer(activeAnswer.indexValue);
   });
}

//funkcja, która odpowiada za restart gry
const resetGame = () => {
   winQuiz.style.display = 'none';
   lostQuiz.style.display = 'none';
   gameQuiz.style.display = 'block';

   showNextQuestion();
}

//funkcja, która daje listenery na restert btns
const handleResetBtns = () => {
   resetBtns.forEach(resetBtn => {
      resetBtn.addEventListener('click', () => {
         resetGame();
      })
   })
}

document.addEventListener('DOMContentLoaded', () => {
   showNextQuestion();
   styleClickedAnswer();
   handleSumbitBtn();
   handleResetBtns();
})