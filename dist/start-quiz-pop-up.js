var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { data } from "./data/data.js";
import QuestionsPopUp from "./main-pop-up.js";
export class StartQuiz {
    set url(value) {
        this._url = value;
    }
    get url() {
        return this._url;
    }
    constructor(selectData) {
        this.selectData = selectData;
        this.popUp = document.querySelector(".pop-up");
        this.renderHTMLStructure();
    }
    getQuizData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.url);
                const data = yield response.json();
                const quizData = [];
                for (let i = 0; i < data.results.length; i++) {
                    const { question, correct_answer, incorrect_answers } = data.results[i];
                    const quizQuestion = {
                        questionNumber: i + 1,
                        question: question,
                        correctAnswer: correct_answer,
                        answerList: incorrect_answers.concat(correct_answer),
                    };
                    quizData.push(quizQuestion);
                }
                return quizData;
            }
            catch (error) {
                if (error instanceof Error) {
                    alert(`${error.name} | ${error.message}`);
                }
            }
        });
    }
    startQuiz() {
        return __awaiter(this, void 0, void 0, function* () {
            const nameInput = document.getElementById("name-input");
            if (nameInput.value.length >= 2 && this.url) {
                const username = nameInput.value;
                sessionStorage.setItem("username", username);
                const data = yield this.getQuizData();
                new QuestionsPopUp(data);
                nameInput.value = "";
            }
            else {
                alert("Type your name or choose a topic!!!");
            }
        });
    }
    setURL(targetOption) {
        const selectedTopic = this.selectData.find(option => option.optionText === targetOption);
        this.url = selectedTopic.url;
        document.body.style.backgroundImage = `url(${selectedTopic.bgi})`;
    }
    createOptions() {
        const select = document.getElementById("quiz-topic");
        for (let i = 0; i < this.selectData.length; i++) {
            const { optionText, url } = this.selectData[i];
            if (i == 0) {
                select.innerHTML += (`<option value="${optionText}" data-url="${url}" selected disabled>${optionText}</option>`);
            }
            else {
                select.innerHTML += (`<option value="${optionText}" data-url="${url}">${optionText}</option>`);
            }
        }
        select.addEventListener("change", (e) => {
            const option = e.target.value;
            this.setURL(option);
        });
    }
    renderHTMLStructure() {
        this.popUp.innerHTML = (`
            <header>
                <h2 class="title">Quiz App</h2>
            </header>
            <main>
                <input type="text" class="name-input" id="name-input" placeholder="Type your name...">
                <div class="select-section">
                    <select name="quiz-topic" id="quiz-topic"></select>
                </div>
            </main>
            <footer>
                <button id="start-quiz" class="btn start-quiz">Start</button>
            </footer>
            `);
        this.createOptions();
        document.getElementById("start-quiz").addEventListener("click", this.startQuiz.bind(this));
        document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1665789318391-6057c533005e?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
    }
}
new StartQuiz(data);
