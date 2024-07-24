/**
 * Exposed data by the api part
 */

import { Event } from "../api/events.ts";
import { VideoDataEvent, VideoEndEvent, VideoStartEvent } from "../api/media/video/event.ts";

export {};

declare global {
    var _rocket: {
        subscribe: <K extends Event>(key: string, callback: (event: K) => void) => string,
        unsubscribe: (uuid: string) => void
    };
    var rocket: {
        subscribe: <K extends Event>(key: string, callback: (event: K) => void) => string,
        unsubscribe: (uuid: string) => void
    };

    var rocketEventsList: {
        media: {
            video: {
                onStart : "media.video.onStart",
                onEnd   : "media.video.onEnd",
                onData  : "media.video.onData"
            }
        },
        alert: "alert"
    };
}