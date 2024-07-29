import { resultData } from "../Modules/resultData";

export default class MainApplication {
    public static main(): void {
        const app = new MainApplication();
        app.start();
    }

    public start(): void {
        const properties: Array<string> = location.href.split("?");
        if (properties.length < 2) {
            location.href = "./index.html";
            return;
        }

        const LANG: number = 1;
        const DATA: number = 2;

        const data: string = decodeURI(properties[DATA]);
        const result: resultData = JSON.parse(data);

        // 結果を表示
        const score: HTMLElement = document.getElementById("score")!;
        const combo: HTMLElement = document.getElementById("combo")!;
        const maxCombo: HTMLElement = document.getElementById("maxCombo")!;
        const inputCount: HTMLElement = document.getElementById("inputCount")!;
        const missCount: HTMLElement = document.getElementById("missCount")!;
        const accuracy: HTMLElement = document.getElementById("accuracy")!;

        score.innerHTML = result.Score;
        combo.innerHTML = result.Combo;
        maxCombo.innerHTML = result.MaxCombo;
        inputCount.innerHTML = result.InputCount;
        missCount.innerHTML = result.MissCount;
        accuracy.innerHTML = result.Accuracy;

        // ボタンのクリックイベント
        const retry: HTMLButtonElement = document.getElementById("retry")! as HTMLButtonElement;
        retry.addEventListener("click", () => {
            location.href = `./game.html?${properties[LANG]}`;
        });

        const title: HTMLButtonElement = document.getElementById("title")! as HTMLButtonElement;
        title.addEventListener("click", () => {
            location.href = `./index.html`;
        });
    }
}