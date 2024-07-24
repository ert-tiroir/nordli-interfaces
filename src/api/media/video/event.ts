import { Event } from "../../events.ts";

export class VideoStartEvent extends Event {
    getName(): string {
        return "media.video.onStart";
    }
};

export class VideoEndEvent extends Event {
    getName(): string {
        return "media.video.onEnd";
    }
};

export class VideoDataEvent extends Event {
    private _data: Uint8Array;

    constructor (data: Uint8Array) {
        super();
        this._data = data;
    }

    public get data () {
        return this._data;
    }

    getName(): string {
        return "media.video.onData";
    }
};
