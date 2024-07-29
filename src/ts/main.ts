export default class MainApplication {
    public static main(): void {
        const app = new MainApplication();
        app.start();
    }

    public start(): void {
        console.log(this.targetString);
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.__keydownEvent(event.key);
        });
    }

    private targetString: string = ("Hello, World!").toLowerCase();
    private targetIndex: number = 0;

    private ignoreIndex: Array<string> = [
        "Shift", "Control", "Alt", "Meta", "ArrowLeft", "ArrowRight", "Backspace", "Delete", "Enter", "Tab", "Escape"
    ];

    private __keydownEvent(key: string): void {
        if (this.ignoreIndex.indexOf(key) >= 0) return;

        if (key === this.targetString[this.targetIndex]) {
            this.targetIndex++;
            console.log("correct");
        } else {
            console.error(`miss\tkey: ${key}`);
        }
    }
}