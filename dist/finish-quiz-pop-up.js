import { data } from "./data/data.js";
import { StartQuiz } from "./start-quiz-pop-up.js";
class FinishQuiz {
    constructor() {
        this.popUp = document.querySelector(".pop-up");
    }
    renderEmoji(score) {
        let correctEmoji = score <= 30 ? "sentiment_dissatisfied" : (score > 30 && score <= 70) ? "sentiment_neutral" : "sentiment_satisfied";
        return correctEmoji;
    }
    showResults(correctAnswers, quizDataLength) {
        const username = sessionStorage.getItem("username");
        const score = (correctAnswers / quizDataLength) * 100;
        const emoji = this.renderEmoji(score);
        this.popUp.innerHTML = (`<header>
                <h2 class="title">Congratulations!</h2>
                <p class="text"><span id="username">${username}</span>, you have just finished a quiz.</p>
            </header>
            <main>
                <p class="result">Your result is: <span>${correctAnswers}</span>/${quizDataLength} <span class="emoji material-symbols-outlined">${emoji}</span></p>
            </main>
            <footer>
                <button id="start-again" class="btn start-again-btn">Start the quiz again</button>
            </footer>`);
        document.getElementById("start-again").addEventListener("click", () => {
            sessionStorage.clear();
            new StartQuiz(data);
        });
    }
}
export const finishQuiz = new FinishQuiz();
