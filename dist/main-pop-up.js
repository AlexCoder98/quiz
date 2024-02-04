import { finishQuiz } from "./finish-quiz-pop-up.js";
export default class QuestionsPopUp {
    set count(value) {
        this._count = value++;
    }
    get count() {
        return this._count;
    }
    set correctAnswers(value) {
        this._correctAnswers = value++;
    }
    get correctAnswers() {
        return this._correctAnswers;
    }
    constructor(questionData) {
        this._count = 0;
        this._correctAnswers = 0;
        this.quizData = questionData;
        this.popUp = document.querySelector(".pop-up");
        this.renderQuestion();
    }
    checkAnswer(correctAnswer) {
        const inputs = document.querySelectorAll(`input[type="checkbox"]`);
        const answerInput = [...inputs].find(el => el.checked);
        if (answerInput) {
            const answer = answerInput.nextElementSibling.textContent;
            if (answer === correctAnswer) {
                this.correctAnswers += 1;
            }
            ;
            return true;
        }
        else {
            alert("Choose the answer!!!");
            return false;
        }
    }
    createAnswers(answers) {
        const answersContainer = document.querySelector(".answers-container");
        answersContainer.innerHTML = "";
        const shuffledArray = answers.sort(() => Math.random() - 0.5);
        for (let i = 0; i < shuffledArray.length; i++) {
            answersContainer.innerHTML += (`<div>
                    <input type="checkbox" id="answer ${i + 1}" />
                    <label for="answer ${i + 1}">${shuffledArray[i]}</label>
                </div>`);
        }
        const inputs = document.querySelectorAll(`input[type="checkbox"]`);
        inputs.forEach(input => input.addEventListener("change", (e) => {
            [...inputs].filter(el => el != e.target).map(el => el.checked = false);
        }));
    }
    next(correctAnswer) {
        const isChecked = this.checkAnswer(correctAnswer);
        if (isChecked) {
            this.count += 1;
            this.renderQuestion();
        }
    }
    renderQuestion() {
        const { questionNumber, question, answerList, correctAnswer } = this.quizData[this.count];
        this.popUp.innerHTML = (`<header>
                <h2 class="title">Question <span id="curr-question" class="curr-question">${questionNumber}</span>/<span id="all-questions" class="all-questions">${this.quizData.length}</span></h2>
            </header>
            <main>
                <div class="question-container">
                    <p class="text question">${question}</p>
                </div>
                <hr>
                <section class="answers-container"></section>
                <hr>
            </main>
            <footer>
                <button id="main-btn" class="btn main-btn">${questionNumber < this.quizData.length ? "Next" : "Finish"}</button>
            </footer>`);
        this.createAnswers(answerList);
        const button = document.getElementById("main-btn");
        button.textContent == "Next" ? button.addEventListener("click", () => this.next(correctAnswer)) : button.addEventListener("click", () => {
            const isChecked = this.checkAnswer(correctAnswer);
            if (isChecked) {
                finishQuiz.showResults(this.correctAnswers, this.quizData.length);
            }
        });
    }
}
