import { RocketAPI } from "../api.ts";
import { Event } from "../events.ts";

export const CRITICAL = "CRITICAL";
export const DANGER   = "DANGER";
export const WARN     = "WARN";
export const INFO     = "INFO";
export const DEBUG    = "DEBUG";
export const SUCCESS  = "SUCCESS";

export class Alert extends Event {
    level   : string;

    title   : string;
    message : string;

    isCritical (): boolean { return this.level == CRITICAL; }
    isDanger   (): boolean { return this.level == DANGER;   }
    isWarning  (): boolean { return this.level == WARN;     }
    isInfo     (): boolean { return this.level == INFO;     }
    isDebug    (): boolean { return this.level == DEBUG;    }
    isSuccess  (): boolean { return this.level == SUCCESS;  }

    getLevel   (): string { return this.level;   }
    getTitle   (): string { return this.title;   }
    getMessage (): string { return this.message; }

    getName(): string {
        return "alert";
    }

    private constructor (level: string, title: string, message: string) {
        super();

        this.level   = level;
        this.title   = title;
        this.message = message;
    }

    private static send (level: string, title: string, message: string) {
        let event = new Alert(level, title, message);

        RocketAPI.instance.dispatch(event);

        return event;
    }
    
    static sendCritical (title: string, message: string) { return Alert.send(CRITICAL, title, message); }
    static sendDanger   (title: string, message: string) { return Alert.send(DANGER,   title, message); }
    static sendWarning  (title: string, message: string) { return Alert.send(WARN,     title, message); }
    static sendInfo     (title: string, message: string) { return Alert.send(INFO,     title, message); }
    static sendDebug    (title: string, message: string) { return Alert.send(DEBUG,    title, message); }
    static sendSuccess  (title: string, message: string) { return Alert.send(SUCCESS,  title, message); }
};
