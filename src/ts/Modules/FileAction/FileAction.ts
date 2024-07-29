export default class FileAction {
    /**
     * - 読み取り対象のファイルパス
     */
    private _filePath: string;

    constructor(path: string) {
        this._filePath = path;
    }

    /**
     * - ファイルから読み取った文字列データをそのまま返す
     * @returns ファイルから読み取った文字列データ
     */
    public normalRead(): string {
        let text: XMLHttpRequest = new XMLHttpRequest();
        text.open("get", this._filePath, false);
        text.send();
        return text.responseText;
    }

    /**
     * - 1行ごとの配列にして返す
     * @returns 1行ごとの配列
     */
    public arrayRead(): Array<string> {
        return this.normalRead().split(/\r\n|\n/);
    }

    /**
     * - csvファイルを2次元配列にして返す
     * @returns csvファイルデータの2次元配列
     */
    public csvRead(): Array<Array<string>> {
        const array: Array<string> = this.arrayRead();
        let result: Array<Array<string>> = new Array(0);

        for (let cnt = 0; cnt < array.length; cnt++) {
            if (array[cnt] == "") break;

            result.push(array[cnt].split(","));
        }
        return result;
    }
}