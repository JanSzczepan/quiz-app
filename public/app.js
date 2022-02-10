const questionNumberEl = document.querySelector('.quiz__question-number');
const questionEl = document.querySelector('.quiz__question-text');
const answerEls = [...document.querySelectorAll('.quiz__answer-text')];
const answerBoxEls = [...document.querySelectorAll('.quiz__answer-item')];
const answerIconEls = [...document.querySelectorAll('.quiz__aswer-icon')];
const submitBtn = document.querySelector('.quiz__aswer-submit');

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

//funkcja, która dodaje klasę do klikniętego pytania i aktualizuje zmienną activeAnswer
const styleClickedAnswer = () => {
   answerBoxEls.forEach((answerBoxEl, index) => {
      answerBoxEl.addEventListener('click', () => {
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

const handleWinner = () => {
   console.log('Win');
}

const handleLoser = () => {
   console.log('Loser');
}

//funkcja, która strzela do serwera prosząc o question and aswers data
const showNextQuestion = () => {
   fetch('/question', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
         console.log(data);
         if(data.winner === true)
            handleWinner();
         else if(data.loser === true)
            handleLoser();
         else
            fillElements(data)
      })
}

const handleAnswerFedback = (data) => {
   showNextQuestion();
}

//funkcja, która wysyła zaznaczony indeks odpowiedzi użytkownika do serwera
const sendAnswer = (answerIndex) => {
   fetch(`/answer/${answerIndex}`, {method: 'POST'})
      .then(response => response.json())
      .then(data => handleAnswerFedback(data))
}

const handleSumbitBtn = () => {
   submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendAnswer(activeAnswer.indexValue);
   });
}

document.addEventListener('DOMContentLoaded', () => {
   showNextQuestion();
   styleClickedAnswer();
   handleSumbitBtn();
})