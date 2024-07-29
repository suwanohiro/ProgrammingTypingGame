export default class MainApplication {
    public static main(): void {
        const app = new MainApplication();
        app.start();
    }

    private __createRandomQuestion(): string {
        const questionList: Array<string> = [
            "Hello, World!",
            "int main(void)",
            "float",
            "double",
            "number",
            "private",
            "public",
            "class",
            "function",
            "return",
            "continue",
            "if",
            "for",
            "while"
        ];
        const min = 0;
        const max = questionList.length - 1;
        const random: number = Math.floor(Math.random() * (max + 1 - min)) + min;
        const result: string = questionList[random];
        const targetString: string = document.getElementById("targetString")!.dataset.targetString!;
        return (targetString == result) ? this.__createRandomQuestion() : this.__convertSpace(result, "SpaceToSymbol");
    }

    public start(): void {
        this.updateString(this.__createRandomQuestion());

        window.addEventListener("keydown", (event: KeyboardEvent) => {
            if (this.__isInputErrorRendering()) return;

            if (event.key == "Enter") {
                this.updateString(this.__createRandomQuestion());
                return;
            }

            this.__keydownEvent(event.key);
        });
    }

    private updateString(targetString: string): void {
        const targetElem: HTMLElement = document.getElementById("targetString")!;

        // 子要素要素をすべて削除
        targetElem.innerHTML = "";
        targetElem.dataset.targetString = this.__convertSpace(targetString, "SymbolToSpace");

        for (let cnt = 0; cnt < targetString.length; cnt++) {
            const span: HTMLSpanElement = document.createElement("span");
            span.innerHTML = targetString[cnt].toString();
            span.classList.add("targetStrings");
            span.classList.add("beforeInput");
            targetElem.appendChild(span);
        }
    }

    private __convertSpace(str: string, type: "SpaceToSymbol" | "SymbolToSpace"): string {
        return (type == "SpaceToSymbol") ? str.replace(" ", "◇") : str.replace("◇", " ");
    }

    private ignoreIndex: Array<string> = [
        "Shift", "Control", "Alt", "Meta", "ArrowLeft", "ArrowRight", "Backspace", "Delete", "Enter", "Tab", "Escape"
    ];

    private __keydownEvent(key: string): void {
        if (this.ignoreIndex.indexOf(key) >= 0) return;

        type HTMLClass<T extends HTMLElement = HTMLElement> = HTMLCollectionOf<T>;
        const beforeInputsElem: HTMLClass = document.getElementsByClassName("beforeInput") as HTMLClass;
        const targetIndexString: string = this.__convertSpace(beforeInputsElem[0].innerHTML, "SymbolToSpace");

        console.log(beforeInputsElem.length);
        if (key == targetIndexString) {
            beforeInputsElem[0].classList.add("afterInput");
            beforeInputsElem[0].classList.remove("beforeInput");

            if (beforeInputsElem.length <= 0) {
                this.updateString(this.__createRandomQuestion());
            }
        } else {
            const target: HTMLElement = document.getElementById("targetString")!;
            setTimeout(() => {
                target.dataset.error = "true";

                setTimeout(() => {
                    target.dataset.error = "false";
                }, 600);
            }, 1);
        }
    }

    private __isInputErrorRendering(): boolean {
        const target: HTMLElement = document.getElementById("targetString")!;
        return target.dataset.error == "true";
    }
}