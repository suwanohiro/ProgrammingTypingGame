import Game from "./Game.js";

export default class MainApplication {
    public static main(): void {
        const app = new MainApplication();
        app.start();
    }

    private _waitTime: number = 3;

    public start(): void {
        this.__countDown();
    }

    private __countDown(): void {
        const countDown: HTMLDivElement = document.getElementById("countDown")! as HTMLDivElement;
        countDown.style.display = "block";
        setTimeout(() => {
            let renderString: string = this._waitTime.toString();
            if (this._waitTime < 1) renderString = "GO!";
            countDown.innerHTML = renderString;
            if (this._waitTime < 0) {
                countDown.style.display = "none";

                // ゲームスタート
                setTimeout(() => { Game.main(); }, 250);
                return;
            }
            this._waitTime--;
            this.__countDown();
        }, 1000);
    }
}