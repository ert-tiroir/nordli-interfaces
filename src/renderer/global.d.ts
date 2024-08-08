/**
 * Exposed data by the api part
 */

import { Alert, AlertCallback } from "../api/alert/event.ts";
import { Event } from "../api/events.ts";

export {};

declare global {
    var _rocket: {
        subscribe: <K extends Event>(key: string, callback: (event: K) => void) => string,
        unsubscribe: (uuid: string) => void,
        alert: {
            debug    : (title: string, message: string, callback?: AlertCallback) => Alert,
            info     : (title: string, message: string, callback?: AlertCallback) => Alert,
            warning  : (title: string, message: string, callback?: AlertCallback) => Alert,
            danger   : (title: string, message: string, callback?: AlertCallback) => Alert,
            critical : (title: string, message: string, callback?: AlertCallback) => Alert,
            success  : (title: string, message: string, callback?: AlertCallback) => Alert
        }
    };
    var rocket: {
        subscribe: <K extends Event>(key: string, callback: (event: K) => void) => string,
        unsubscribe: (uuid: string) => void,
        alert: {
            debug    : (title: string, message: string, callback?: AlertCallback) => Alert,
            info     : (title: string, message: string, callback?: AlertCallback) => Alert,
            warning  : (title: string, message: string, callback?: AlertCallback) => Alert,
            danger   : (title: string, message: string, callback?: AlertCallback) => Alert,
            critical : (title: string, message: string, callback?: AlertCallback) => Alert,
            success  : (title: string, message: string, callback?: AlertCallback) => Alert
        }
    };

    var rocketEventsList: {
        media: {
            video: {
                onStart : "media.video.onStart",
                onEnd   : "media.video.onEnd",
                onData  : "media.video.onData"
            }
        },
        alert   : "alert",
        network : {
            change : "network.change",
            init   : "network.init"
        }
    };
}