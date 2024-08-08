
import { Event } from "../events.ts";
import { NetworkStatus } from "./status.ts";

export class NetworkChangedEvent extends Event {
    getName(): string {
        return "network.changed";
    }

    readonly message       : string;
    readonly networkStatus : NetworkStatus;

    constructor (message: string, networkStatus: NetworkStatus) {
        super();

        this.message       = message;
        this.networkStatus = networkStatus;
    }
};

export class NetworkInitEvent extends Event {
    getName(): string {
        return "network.init";
    }
};
