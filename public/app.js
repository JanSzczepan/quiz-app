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
const barEls = [...document.querySelectorAll('.quiz__answer-item .quiz__bar')];

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
let isHelpUsed = false;

//funckaj, która zdejmuje style z zaznaczonych odpowiedzi
const removeAnswerBoxElsStyle = (next=false) => {
   const activeClass = 'quiz__answer-item--active';
   const activeIcon = 'fa-dot-circle';
   const icon = 'fa-circle';
   const phoneIcon = 'fa-mobile-alt';
   const fiftyIcon = 'fa-star-half-alt';
   const activeBar = 'quiz__bar--white';

   answerBoxEls.forEach((boxEl, index) => {
      if(boxEl.classList.contains(activeClass)) {
         boxEl.classList.remove(activeClass);
      } 
      if(next && answerIconEls[index].classList.contains(phoneIcon)) {
         answerIconEls[index].classList.remove('fas', phoneIcon);
         answerIconEls[index].classList.add('far', icon);
      }
      if(next && answerIconEls[index].classList.contains(fiftyIcon)) {
         answerIconEls[index].classList.remove('fas', fiftyIcon);
         answerIconEls[index].classList.add('far', icon);
      }
      if(answerIconEls[index].classList.contains(activeIcon)) {
         answerIconEls[index].classList.remove(activeIcon);
         answerIconEls[index].classList.add(icon);
      }
      if(barEls[index].classList.contains(activeBar)) {
         barEls[index].classList.remove(activeBar);
      }
      if(next) {
         barEls[index].style.display = 'none';
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
         const fiftyIcon = 'fa-star-half-alt';
         const activeBar = 'quiz__bar--white';
         
         removeAnswerBoxElsStyle();

         answerBoxEl.classList.add(activeClass);
         if(!answerIconEls[index].classList.contains(phoneIcon) && 
            !answerIconEls[index].classList.contains(fiftyIcon)) {
            answerIconEls[index].classList.remove(icon);
            answerIconEls[index].classList.add(activeIcon);
         }
         barEls[index].classList.add(activeBar);

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
   gameQuiz.scrollTop = -1000;
}

//funkcja, która obsługuje zdarzenia po wygranej
const handleWinner = (data) => {
   areHelpBtnsBlocked = true;
   gameQuiz.style.display = 'none';
   winQuiz.style.display = 'flex';
   winQuiz.scrollTop = -1000;
}

//funkcja, która obsługuje zdarzenia po przegranej
const handleLoser = (data) => {
   areHelpBtnsBlocked = true;
   gameQuiz.style.display = 'none';

   lostNumberEl.textContent = `${data.goodAnswers}/${data.amountOfQuestions}`
   lostQuiz.style.display = 'flex';
   lostQuiz.scrollTop = -1000;
}

//funkcja, która strzela do serwera prosząc o question, aswers data oraz info o ewentualnej wygranej lub przegranej
const showNextQuestion = () => {
   fetch('/question', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
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
         isHelpUsed = false;
      }
   });
}

//funkcja, która odpowiada za restart gry
const resetGame = () => {
   if(friendIcon.classList.contains('aside__icon--used')) {
      friendIcon.classList.remove('aside__icon--used');
   }
   if(publicIcon.classList.contains('aside__icon--used')) {
      publicIcon.classList.remove('aside__icon--used');
   }
   if(fiftyFiftyIcon.classList.contains('aside__icon--used')) {
      fiftyFiftyIcon.classList.remove('aside__icon--used');
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

//funkcja, która obsługuje odpowiedź przyjaciela od serwera
const handleFriendFedback = (data) => {
   if(!data.friendAnswer && data.friendAnswer !== 0) {
      return;
   }
   isHelpUsed = true;

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

//funkcja, która obsługuje odpowiedź publiczności  od serwera
const handlePublicFedback = (data) => {
   if(!data.votes) {
      return;
   }
   isHelpUsed = true;

   barEls.forEach((bar, index) => {
      bar.style.display = 'block';
      document.documentElement.style.setProperty(`--bar-width-${index}`, `${data.votes[index]}%`);
      bar.style.animationPlayState = 'running';
   });

   publicIcon.classList.add('aside__icon--used');
}

//funkcja, która obsługuje odpowiedź fifty-fifty od serwera
const handleFiftyFedback = (data) => {
   if(!data.fiftyAnswer) {
      return;
   }
   isHelpUsed = true;

   const activeIcon = 'fa-dot-circle';
   const icon = 'fa-circle';
   const fiftyIcon = 'fa-star-half-alt';

   data.fiftyAnswer.forEach(answer => {
      if(answerIconEls[answer].classList.contains(icon)) {
         answerIconEls[answer].classList.remove('far', icon)
      } else if(answerIconEls[answer].classList.contains(activeIcon)) {
         answerIconEls[answer].classList.remove('far', activeIcon)
      }

      answerIconEls[answer].classList.add('fas', fiftyIcon);
   })

   fiftyFiftyIcon.classList.add('aside__icon--used');
}

//funkcja, która wysyła rządanie do serwera o poprawną odpowiedź przyjaciela
const askFriend = () => {
   if(areHelpBtnsBlocked || isHelpUsed) return;

   fetch('/help/friend', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
         handleFriendFedback(data);
      })
}

//funkcja, która wysyła rządanie do serwera o odpowiedź publiczności
const askPublic = () => {
   if(areHelpBtnsBlocked || isHelpUsed) return;

   fetch('/help/public', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
         handlePublicFedback(data);
      })
}

//funkcja, która wysyła rządanie do serwera o odpowiedź fiftyFifty
const fiftyFifty = () => {
   if(areHelpBtnsBlocked || isHelpUsed) return;

   fetch('/help/fifty', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
         handleFiftyFedback(data);
      })
}

//funkcja, która dodaje nasłuchy na btns w aside
const handleAsideBtns = () => {
   friendBtn.addEventListener('click', () => {
      askFriend();
   });
   publicBtn.addEventListener('click', () => {
      askPublic();
   });
   fiftyFiftyBtn.addEventListener('click', () => {
      fiftyFifty();
   });
}

document.addEventListener('DOMContentLoaded', () => {
   showNextQuestion();
   styleClickedAnswer();
   handleSumbitBtn();
   handleResetBtns();
   handleAsideBtns();
})