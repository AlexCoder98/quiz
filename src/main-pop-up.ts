import { Question } from "./types/quiz-data";
import { finishQuiz } from "./finish-quiz-pop-up.js";

export default class QuestionsPopUp {
    private quizData: Question[];
    private popUp: HTMLElement;

    _count: number = 0;
    _correctAnswers: number = 0;
    set count(value: number) {
        this._count = value++;
    }

    get count(): number {
        return this._count;
    }

    set correctAnswers(value: number) {
        this._correctAnswers = value++;
    }
    get correctAnswers(): number {
        return this._correctAnswers;
    }

    constructor(questionData: Question[]) {
        this.quizData = questionData;
        this.popUp = document.querySelector(".pop-up") as HTMLElement;
        this.renderQuestion();
    }

    // Checking if user's answer is correct
    private checkAnswer(correctAnswer: string) {
        const inputs = document.querySelectorAll(`input[type="checkbox"]`) as NodeListOf<HTMLInputElement>;
        const answerInput = [...inputs].find(el => el.checked)!;
        if (answerInput) {
            const answer = (answerInput.nextElementSibling as HTMLElement).textContent!;
            if (answer === correctAnswer) {
                this.correctAnswers += 1;
            };
            return true;
        } else {
            alert("Choose the answer!!!");
            return false;
        }
    }

    // Creating answer list
    private createAnswers(answers: string[]) {
        const answersContainer = document.querySelector(".answers-container") as HTMLElement;
        answersContainer.innerHTML = "";

        const shuffledArray = answers.sort(() => Math.random() - 0.5);

        for (let i = 0; i < shuffledArray.length; i++) {
            answersContainer.innerHTML += (
                `<div>
                    <input type="checkbox" id="answer ${i + 1}" />
                    <label for="answer ${i + 1}">${shuffledArray[i]}</label>
                </div>`
            )
        }

        // Make sure to have only 1 checked input on the list
        const inputs = document.querySelectorAll(`input[type="checkbox"]`) as NodeListOf<HTMLInputElement>;
        inputs.forEach(input => input.addEventListener("change", (e: Event) => {
            [...inputs].filter(el => el != e.target).map(el => el.checked = false);
        }));
    }

    // Checking if answer is chosen and move on
    private next(correctAnswer: string) {
        const isChecked = this.checkAnswer(correctAnswer);
        if (isChecked) {
            this.count += 1;
            this.renderQuestion();
        }
    }

    // Rendering the whole question HTML structure
    private renderQuestion() {
        const { questionNumber, question, answerList, correctAnswer } = this.quizData[this.count];

        this.popUp.innerHTML = (
            `<header>
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
            </footer>`
        );

        this.createAnswers(answerList);

        // Choosing click event method regarding to button's text content
        const button = document.getElementById("main-btn") as HTMLButtonElement;

        button.textContent == "Next" ? button.addEventListener("click", () => this.next(correctAnswer)) : button.addEventListener("click", () => {
            const isChecked = this.checkAnswer(correctAnswer);
            if (isChecked) {
                finishQuiz.showResults(this.correctAnswers, this.quizData.length)
            }
        });
    }
}