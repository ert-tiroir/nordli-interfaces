import { CONFIG } from "../../config.ts";
import { RocketAPI } from "../api.ts";
import { Event } from "../events.ts";

export const CRITICAL = "CRITICAL";
export const DANGER   = "DANGER";
export const WARN     = "WARN";
export const INFO     = "INFO";
export const DEBUG    = "DEBUG";
export const SUCCESS  = "SUCCESS";

export class AlertCallback {
    readonly callback: (accepted: boolean) => void;

    readonly onClose: () => void;

    readonly acceptString: string;
    readonly declineString: string;

    constructor (callback: (accepted: boolean) => void, accept: string, decline: string, onClose?: () => void) {
        this.callback = callback;

        this.acceptString  = accept;
        this.declineString = decline;

        if (onClose === undefined) onClose = () => {};
        this.onClose = onClose;
    }

    static defaultNamedCallback (callback: (accepted: boolean) => void) {
        return new AlertCallback(callback, CONFIG.alert.DEFAULT_ACCEPT_STRING, CONFIG.alert.DEFAULT_DECLINE_STRING);
    }
};

export class Alert extends Event {
    level   : string;

    title   : string;
    message : string;

    callback?: AlertCallback;

    isCritical (): boolean { return this.level == CRITICAL; }
    isDanger   (): boolean { return this.level == DANGER;   }
    isWarning  (): boolean { return this.level == WARN;     }
    isInfo     (): boolean { return this.level == INFO;     }
    isDebug    (): boolean { return this.level == DEBUG;    }
    isSuccess  (): boolean { return this.level == SUCCESS;  }

    getLevel   (): string { return this.level;   }
    getTitle   (): string { return this.title;   }
    getMessage (): string { return this.message; }

    getCallback (): AlertCallback | undefined {
        return this.callback;
    }

    getName(): string {
        return "alert";
    }

    private constructor (level: string, title: string, message: string, callback?: AlertCallback) {
        super();

        this.level   = level;
        this.title   = title;
        this.message = message;

        this.callback = callback;
    }

    private static send (level: string, title: string, message: string, callback?: AlertCallback) {
        let event = new Alert(level, title, message, callback);

        RocketAPI.instance.dispatch(event);

        return event;
    }
    
    static sendCritical (title: string, message: string, callback?: AlertCallback) { return Alert.send(CRITICAL, title, message, callback); }
    static sendDanger   (title: string, message: string, callback?: AlertCallback) { return Alert.send(DANGER,   title, message, callback); }
    static sendWarning  (title: string, message: string, callback?: AlertCallback) { return Alert.send(WARN,     title, message, callback); }
    static sendInfo     (title: string, message: string, callback?: AlertCallback) { return Alert.send(INFO,     title, message, callback); }
    static sendDebug    (title: string, message: string, callback?: AlertCallback) { return Alert.send(DEBUG,    title, message, callback); }
    static sendSuccess  (title: string, message: string, callback?: AlertCallback) { return Alert.send(SUCCESS,  title, message, callback); }
};
