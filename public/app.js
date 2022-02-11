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
const friendBtn = document.querySelector('.aside__btn--friend');
const publicBtn = document.querySelector('.aside__btn--public');
const fiftyFiftyBtn = document.querySelector('.aside__btn--fifty');
const friendIcon = document.querySelector('.aside__btn--friend .aside__icon');
const publicIcon = document.querySelector('.aside__btn--public .aside__icon');
const fiftyFiftyIcon = document.querySelector('.aside__btn--fifty .aside__icon');

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

let areHelpBtnsBlocked = false;

//funckaj, która zdejmuje style z zaznaczonych odpowiedzi
const removeAnswerBoxElsStyle = (next=false) => {
   const activeClass = 'quiz__answer-item--active';
   const activeIcon = 'fa-dot-circle';
   const icon = 'fa-circle';
   const phoneIcon = 'fa-mobile-alt';

   answerBoxEls.forEach((boxEl, index) => {
      if(boxEl.classList.contains(activeClass)) {
         boxEl.classList.remove(activeClass);
      } 
      if(next && answerIconEls[index].classList.contains(phoneIcon)) {
         answerIconEls[index].classList.remove('fas', phoneIcon);
         answerIconEls[index].classList.add('far', icon);
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
         const phoneIcon = 'fa-mobile-alt';
         
         removeAnswerBoxElsStyle();

         answerBoxEl.classList.add(activeClass);
         if(!answerIconEls[index].classList.contains(phoneIcon)) {
            answerIconEls[index].classList.remove(icon);
            answerIconEls[index].classList.add(activeIcon);
         }

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
   areHelpBtnsBlocked = true;
   gameQuiz.style.display = 'none';
   winQuiz.style.display = 'flex';
}

//funkcja, która obsługuje zdarzenia po przegranej
const handleLoser = (data) => {
   areHelpBtnsBlocked = true;
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
      if(activeAnswer.indexValue !== null) {
         removeAnswerBoxElsStyle(true);
         sendAnswer(activeAnswer.indexValue);
         activeAnswer.indexValue = null;
      }
   });
}

//funkcja, która odpowiada za restart gry
const resetGame = () => {
   if(friendIcon.classList.contains('aside__icon--used')) {
      friendIcon.classList.remove('aside__icon--used');
   }

   winQuiz.style.display = 'none';
   lostQuiz.style.display = 'none';
   gameQuiz.style.display = 'block';

   areHelpBtnsBlocked = false

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

const handleFriendFedback = (data) => {
   if(!data.friendAnswer && data.friendAnswer !== 0) {
      return;
   }

   const activeIcon = 'fa-dot-circle';
   const icon = 'fa-circle';
   const phoneIcon = 'fa-mobile-alt';

   const answerIconEl = answerIconEls[data.friendAnswer];
   
   if(answerIconEl.classList.contains(icon)) {
      answerIconEl.classList.remove('far', icon)
   } else if(answerIconEl.classList.contains(activeIcon)) {
      answerIconEl.classList.remove('far', activeIcon)
   }

   answerIconEl.classList.add('fas', phoneIcon);
   friendIcon.classList.add('aside__icon--used');
}

const askFriend = () => {
   if(areHelpBtnsBlocked) return;

   fetch('/help/friend', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
         console.log(data)
         handleFriendFedback(data);
      })
}

const handleAsideBtns = () => {
   friendBtn.addEventListener('click', () => {
      askFriend();
   })
}

document.addEventListener('DOMContentLoaded', () => {
   showNextQuestion();
   styleClickedAnswer();
   handleSumbitBtn();
   handleResetBtns();
   handleAsideBtns();
})