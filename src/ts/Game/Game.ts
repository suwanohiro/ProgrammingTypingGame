import FileAction from "../Modules/FileAction/FileAction.js";
import { resultData } from "../Modules/resultData.js";

export default class Game {
    // -----------------------------------------------
    // public (static)
    // -----------------------------------------------
    public static main(): void {
        new Game().start();
    }

    constructor() {
        this._questionList = new Array<string>();
    }

    // -----------------------------------------------
    // private
    // -----------------------------------------------

    private _isActive: boolean = false;
    private _gameTime: number = 120;    // ゲーム時間 (秒)
    private _questionList: Array<string>;

    /**
     * スペース文字と記号を置き換える
     * @param str 対象の文字列
     * @param type 置き換え方法
     * @returns 置き換え後の文字列
     */
    private __convertSpace(str: string, type: "SpaceToSymbol" | "SymbolToSpace"): string {
        return (type == "SpaceToSymbol") ? str.replace(" ", "◇") : str.replace("◇", " ");
    }

    /**
     * ランダムに入力対象の文字列を選択する
     * @returns 選択された文字列
     */
    private __createRandomQuestion(): string {
        const min = 0;
        const max = this._questionList.length - 1;
        const random: number = Math.floor(Math.random() * (max + 1 - min)) + min;
        const result: string = this._questionList[random];
        const targetString: string = document.getElementById("targetString")!.dataset.targetString!;
        return (targetString == result) ? this.__createRandomQuestion() : this.__convertSpace(result, "SpaceToSymbol");
    }

    /**
     * ゲームの初期化処理
     */
    private __initialize(): void {
        const target: HTMLElement = document.getElementById("targetString")!;
        target.dataset.error = "false";
        this._isActive = true;

        const tmp = location.href.split("?");

        if (tmp.length < 2) {
            alert("言語が選択されていません。");
            location.href = "./index.html";
            return;
        }

        const langFileName: string = tmp[1]!;
        const flie: FileAction = new FileAction(`res/${langFileName}.csv`);
        this._questionList = flie.arrayRead();

        this.__nextQuestion();
    }

    /**
     * 入力ミスの演出中かどうか
     * @returns 演出中ならtrue, そうでなければfalse
     */
    private __isInputErrorRendering(): boolean {
        const target: HTMLElement = document.getElementById("targetString")!;
        return target.dataset.error == "true";
    }

    /**
     * キーが押されたときの処理
     * @param key 押されたキーの文字
     */
    private __keydownEvent(key: string): void {
        // 判定対象の文字が現在のインデックスと一致するか確認
        type HTMLClass<T extends HTMLElement = HTMLElement> = HTMLCollectionOf<T>;
        const beforeInputsElem: HTMLClass = document.getElementsByClassName("beforeInput") as HTMLClass;
        const targetIndexString: string = this.__convertSpace(beforeInputsElem[0].innerHTML, "SymbolToSpace");

        // 入力回数を更新
        const inputCountElem: HTMLElement = document.getElementById("inputCount")!;
        const inputCount: number = parseInt(inputCountElem.innerHTML.replace(",", "")) + 1;
        inputCountElem.innerHTML = inputCount.toLocaleString();

        // 対象の文字と入力された文字が一致していれば
        if (key == targetIndexString) {
            beforeInputsElem[0].classList.add("afterInput");
            beforeInputsElem[0].classList.remove("beforeInput");

            // 最後の文字まで入力したら次の問題へ
            if (beforeInputsElem.length <= 0) {
                const combo: HTMLElement = document.getElementById("combo")!;
                const comboCount: number = parseInt(combo.innerHTML) + 1;
                combo.innerHTML = comboCount.toString();

                const maxComboElem: HTMLElement = document.getElementById("maxCombo")!;
                const maxCombo: number = parseInt(maxComboElem.innerHTML);
                if (comboCount > maxCombo) maxComboElem.innerHTML = comboCount.toString();

                // コンボ数に応じて残り時間を増加 (最大1秒)
                const gameTime: HTMLMeterElement = document.getElementById("gameTime")! as HTMLMeterElement;
                gameTime.value += Math.min(comboCount * 0.01, 1) * 100;

                // 残り時間に応じてスコアを追加
                const targetString: string = document.getElementById("targetString")!.dataset.targetString!;
                const meter: HTMLMeterElement = document.getElementById("current")! as HTMLMeterElement;
                const scoreElem: HTMLElement = document.getElementById("score")!;
                const nowScore: number = parseInt(scoreElem.innerHTML.replace(",", ""));
                const late: number = meter.value / meter.max + 1;
                const score: number = Math.floor(nowScore + targetString.length * late);
                scoreElem.innerHTML = score.toLocaleString();

                this.__nextQuestion();
            }
        } else {
            // ミスした時の処理
            const combo: HTMLElement = document.getElementById("combo")!;
            combo.innerHTML = "0";

            const missCountElem: HTMLElement = document.getElementById("missCount")!;
            const missCount: number = parseInt(missCountElem.innerHTML) + 1;
            missCountElem.innerHTML = missCount.toString();

            const target: HTMLElement = document.getElementById("targetString")!;
            setTimeout(() => {
                target.dataset.error = "true";
                setTimeout(() => { target.dataset.error = "false"; }, 600);
            }, 1);
        }

        // 正答率更新
        const accuracy: HTMLElement = document.getElementById("accuracy")!;
        const missCountElem: HTMLElement = document.getElementById("missCount")!;
        const missCount: number = parseInt(missCountElem.innerHTML);
        const percent: number = ((inputCount - missCount) / inputCount) * 100;
        const integer: number = Math.floor(percent);
        const float: number = Math.floor(percent * 100) % 100;
        accuracy.innerHTML = `${integer.toString().padStart(2, "0")}.${float.toString().padStart(2, "0")}`;
    }

    /**
     * 次の問題を表示させる
     */
    private __nextQuestion(): void {
        const question: string = this.__createRandomQuestion();
        this.__updateString(question);

        // 問題履歴更新
        const historyElem: HTMLElement = document.getElementById("History")!;
        const div: HTMLDivElement = document.createElement("div");
        div.innerHTML = this.__convertSpace(question, "SymbolToSpace");
        div.classList.add("questionHistory");
        historyElem.prepend(div);

        // メーター関連処理
        const meter: HTMLMeterElement = document.getElementById("current")! as HTMLMeterElement;
        const late: number = 75; // 1文字あたりの秒数 (ms * 10)

        // 文字数に応じた長さ (最低2秒)
        const time: number = Math.max(question.length * late, 2 * 100);
        meter.max = time;
        meter.optimum = time;
        meter.high = Math.floor(time * 0.5);
        meter.low = Math.floor(time * 0.25);
        meter.value = time;
    }

    private __updateString(targetString: string): void {
        const targetElem: HTMLElement = document.getElementById("targetString")!;

        // 子要素要素をすべて削除
        targetElem.innerHTML = "";
        targetElem.dataset.targetString = this.__convertSpace(targetString, "SymbolToSpace");

        // 1文字ずつspan要素にして追加
        for (let cnt = 0; cnt < targetString.length; cnt++) {
            const span: HTMLSpanElement = document.createElement("span");
            span.innerHTML = targetString[cnt].toString();
            span.classList.add("targetStrings");
            span.classList.add("beforeInput");
            targetElem.appendChild(span);
        }
    }

    // -----------------------------------------------
    // public
    // -----------------------------------------------
    public start(): void {
        // 初期化
        this.__initialize();

        window.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key == " ") {
                event.preventDefault();
            }

            // アクティブ状態でなければここで処理終了
            if (!this._isActive) return;

            // 入力ミス演出中ならここで処理終了
            if (this.__isInputErrorRendering()) return;

            // 特定の除外キーが押されたらここで処理終了
            const ignoreIndex: Array<string> = [
                "Shift", "Control", "Alt", "Meta", "ArrowLeft", "ArrowRight", "Backspace", "Delete", "Enter", "Tab", "Escape"
            ];
            if (ignoreIndex.indexOf(event.key) >= 0) return;

            this.__keydownEvent(event.key);
        });


        const current: HTMLMeterElement = document.getElementById("current")! as HTMLMeterElement;
        const gameTime: HTMLMeterElement = document.getElementById("gameTime")! as HTMLMeterElement;
        const timeElem: HTMLElement = document.getElementById("time")!;

        const gameTimeMSecond: number = this._gameTime * 100;
        gameTime.min = 0;
        gameTime.max = gameTimeMSecond;
        gameTime.value = gameTimeMSecond;
        gameTime.optimum = gameTimeMSecond;
        gameTime.high = Math.floor(gameTimeMSecond * 0.5);
        gameTime.low = Math.floor(gameTimeMSecond * 0.25);

        setInterval(() => {
            // アクティブ状態でなければここで処理終了
            if (!this._isActive) return;

            current.value = Math.floor(Math.max(current.value - 1, 0));
            gameTime.value = Math.floor(Math.max(gameTime.value - 1, 0));

            const timestr: string = Math.floor(gameTime.value / 100).toString().padStart(3, "0");
            const mtimestr: string = Math.floor(gameTime.value % 100).toString().padStart(2, "0");

            timeElem.innerHTML = `( ${timestr}.${mtimestr} 秒 )`;

            if (gameTime.value == 0) {
                // ゲーム終了処理
                this._isActive = false;
                const lang: string = location.href.split("?")[1];

                const score: string = document.getElementById("score")!.innerHTML;
                const combo: string = document.getElementById("combo")!.innerHTML;
                const maxCombo: string = document.getElementById("maxCombo")!.innerHTML;
                const inputCount: string = document.getElementById("inputCount")!.innerHTML;
                const missCount: string = document.getElementById("missCount")!.innerHTML;
                const accuracy: string = document.getElementById("accuracy")!.innerHTML;

                const result: resultData = {
                    Score: score,
                    Combo: combo,
                    MaxCombo: maxCombo,
                    InputCount: inputCount,
                    MissCount: missCount,
                    Accuracy: accuracy
                };

                location.href = `./result.html?${lang}?${encodeURI(JSON.stringify(result))}`;
            }

            if (current.value == 0) {
                this.__nextQuestion();
            }
        }, 10);
    }
}