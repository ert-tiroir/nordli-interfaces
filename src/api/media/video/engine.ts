import { VideoInputDevice } from "./input.ts";
import { VideoMiddlewareDevice } from "./middleware.ts";
import { VideoOutputDevice } from "./output.ts";

export class VideoEngine {
    readonly input  : VideoInputDevice;
    readonly output : VideoOutputDevice;

    readonly middlewareChain: (data: Buffer) => void;

    readonly middlewaresFunctions : {
        onstart: () => void,
        ondata : (data: Buffer) => void,
        onend  : () => void
    }[];

    constructor (input : VideoInputDevice, output: VideoOutputDevice, middlewares?: VideoMiddlewareDevice[]) {
        this.input  = input;
        this.output = output;

        if (middlewares === undefined) middlewares = [];

        let middlewareChain = (data: Buffer) => this.output.onData(data);

        this.middlewaresFunctions = [];

        for (let i = middlewares.length - 1; i >= 0; i --) {
            const data = middlewares[i].init( middlewareChain );
            this.middlewaresFunctions.push( data );

            middlewareChain = data.ondata;
        }

        this.middlewaresFunctions.reverse();

        this.middlewareChain = middlewareChain;
    }

    init () {
        for (let middlewareFunctions of this.middlewaresFunctions)
            middlewareFunctions.onstart();
        this.input.init(this);
    }

    onStart () {
        this.output.onStart();
    }
    onData (data: Buffer) {
        this.middlewareChain(data);
    }
    onEnd () {
        for (let middlewareFunctions of this.middlewaresFunctions)
            middlewareFunctions.onend();
        this.output.onEnd();
    }
};
