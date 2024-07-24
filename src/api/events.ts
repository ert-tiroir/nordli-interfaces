
export abstract class Event {
    abstract getName (): string;
};

type EventContainerType = { [key: string]: string | EventContainerType };

export type EventCallback = (event: Event) => void;

export const EVENT_TYPES = (function (names: string[]): EventContainerType {
    const dict: EventContainerType = {};
    for (let name of names) {
        const subnames = name.split(".");

        let lcd: EventContainerType = dict;
        for (let i = 0; i + 1 < subnames.length; i ++) {
            const subname = subnames[i];
            if (lcd[subname] === undefined) lcd[subname] = {};
            
            const newLCD = lcd[subname];
            if (typeof newLCD === "string" || newLCD instanceof String)
                throw "Invalid event types configuration";
            lcd = newLCD;
        }

        lcd[subnames[subnames.length - 1]] = name;
    }

    return dict;
})(
    [
        "media.video.onStart",
        "media.video.onData",
        "media.video.onEnd",

        "alert"
    ]
);
