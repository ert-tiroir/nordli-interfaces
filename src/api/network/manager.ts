
export class NetworkManager {
    private static _instance: NetworkManager;

    private constructor () {}

    public static get instance()
    {
        return this._instance || (this._instance = new this());
    }
};
