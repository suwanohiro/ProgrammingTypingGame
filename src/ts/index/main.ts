import FileAction from "../Modules/FileAction/FileAction.js";

export default class MainApplication {
    public static main(): void {
        const app = new MainApplication();
        app.start();
    }

    public start(): void {
        const lang: FileAction = new FileAction("res/Language.csv");
        const langArray: Array<string> = lang.arrayRead();

        const langSelect: HTMLSelectElement = document.getElementById("langSelect") as HTMLSelectElement;
        for (let cnt = 0; cnt < langArray.length; cnt++) {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = langArray[cnt];

            let innerHTML: string = langArray[cnt];
            if (langArray[cnt] == "cs") innerHTML = "C#";
            if (langArray[cnt] == "cpp") innerHTML = "C++";

            option.innerHTML = innerHTML;
            langSelect.appendChild(option);
        }

        const start: HTMLButtonElement = document.getElementById("start") as HTMLButtonElement;
        start.addEventListener("click", () => {
            const targetLang: string = langSelect.value;

            if (targetLang == "none") {
                alert("言語を選択してください");
                return;
            }

            location.href = `./game.html?${targetLang}`;
        });
    }
}