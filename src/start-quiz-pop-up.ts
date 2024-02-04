import { data, Data } from "./data/data.js";
import { Welcome } from "./types/response.js";
import { Question } from "./types/quiz-data.js";
import QuestionsPopUp from "./main-pop-up.js";

export class StartQuiz {
    private selectData: Data;
    private popUp: HTMLElement;
    private _url: string;

    set url(value: string) {
        this._url = value;
    }

    get url(): string {
        return this._url;
    }

    constructor(selectData: Data) {
        this.selectData = selectData;
        this.popUp = document.querySelector(".pop-up") as HTMLElement;
        this.renderHTMLStructure();
    }

    // Fetching data for the quiz from the API
    private async getQuizData() {
        try {
            const response = await fetch(this.url);
            const data: Welcome = await response.json();

            const quizData: Question[] = [];

            for (let i = 0; i < data.results.length; i++) {
                const { question, correct_answer, incorrect_answers } = data.results[i];

                const quizQuestion: Question = {
                    questionNumber: i + 1,
                    question: question,
                    correctAnswer: correct_answer,
                    answerList: incorrect_answers.concat(correct_answer),
                }
                quizData.push(quizQuestion);
            }
            return quizData;
        } catch (error) {
            if (error instanceof Error) {
                alert(`${error.name} | ${error.message}`);
            }
        }

    }

    // Starting the quiz and creating the new MainPopUp class instance
    private async startQuiz() {
        const nameInput = document.getElementById("name-input") as HTMLInputElement;
        if (nameInput.value.length >= 2 && this.url) {
            const username = nameInput.value;
            sessionStorage.setItem("username", username);
            const data = await this.getQuizData();
            new QuestionsPopUp(data as Question[]);
            nameInput.value = "";
        } else {
            alert("Type your name or choose a topic!!!");
        }
    }

    // Setting URL depending on the topic
    private setURL(targetOption: string) {
        const selectedTopic = this.selectData.find(option => option.optionText === targetOption)!;
        this.url = selectedTopic.url;
        document.body.style.backgroundImage = `url(${selectedTopic.bgi})`;
    }

    // Creating options for select tags depending on data
    private createOptions() {
        const select = document.getElementById("quiz-topic")! as HTMLSelectElement;
        for (let i = 0; i < this.selectData.length; i++) {
            const { optionText, url } = this.selectData[i];
            if (i == 0) {
                select.innerHTML += (
                    `<option value="${optionText}" data-url="${url}" selected disabled>${optionText}</option>`
                )
            } else {
                select.innerHTML += (
                    `<option value="${optionText}" data-url="${url}">${optionText}</option>`
                )
            }
        }
        select.addEventListener("change", (e: Event) => {
            const option = (e.target as HTMLSelectElement).value;
            this.setURL(option);
        })
    }

    // Rendering the whole HTML structure of StartQuiz PopUp
    renderHTMLStructure() {
        this.popUp.innerHTML = (
            `
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
            `
        )

        this.createOptions();
        (document.getElementById("start-quiz") as HTMLButtonElement).addEventListener("click", this.startQuiz.bind(this));

        document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1665789318391-6057c533005e?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
    }
}

new StartQuiz(data);