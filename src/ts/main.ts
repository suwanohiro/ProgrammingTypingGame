import Game from "./Modules/Game/Game.js";

export default class MainApplication {
    public static main(): void {
        const app = new MainApplication();
        app.start();
    }

    public start(): void {
        Game.main();
    }
}