import Game from "./Game.js";

export default class MainApplication {
    public static main(): void {
        const app = new MainApplication();
        app.start();
    }

    public start(): void {
        Game.main();
    }
}