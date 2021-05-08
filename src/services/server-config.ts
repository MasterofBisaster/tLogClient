class ServerConfig {
    private _host = "http://localhost:3000/api";
    private _loginURI = `${this._host}/login`;
    private _registerURI = `${this._host}/users`;
    private _tripURI = `${this._host}/trips`;
    private _myTripURI = `${this._host}/trips/mine`;
    private _poiURL = `${this._host}/pois`;

    public get host(): string {
        return this._host
    };

    public get loginURI(): string {
        return this._loginURI
    };

    public get registerURI(): string {
        return this._registerURI
    };

    public get tripURI(): string {
        return this._tripURI
    };

    public get myTripURI(): string {
        return this._myTripURI
    };

    public get poiURL(): string {
        return this._poiURL
    };

}

export default new ServerConfig()