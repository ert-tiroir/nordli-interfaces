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
    private _data: Buffer;

    constructor (data: Buffer) {
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
