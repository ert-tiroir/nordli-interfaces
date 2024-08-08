
export enum DeviceSystemStatus {
    ONLINE,
    OFFLINE
};

export class Device {
    private static _instances: { rpiav: Device, rpigs: Device, espav: Device, espgs: Device };

    private static init () {
        if (this._instances) return;

        this._instances = {
            rpiav : new Device(),
            rpigs : new Device(),
            espgs : new Device(),
            espav : new Device()
        };
    }

    public static get raspberryPIAvionics() {
        this.init();
        return this._instances.rpiav;
    }
    public static get esp32Avionics() {
        this.init();
        return this._instances.espav;
    }
    public static get esp32Ground() {
        this.init();
        return this._instances.espgs;
    }
    public static get raspberryPIGround() {
        this.init();
        return this._instances.rpigs;
    }
};

export class DeviceStatus {
    readonly powerOn: DeviceSystemStatus;

    readonly sensors?: {
        camera  : DeviceSystemStatus, // Video
        spatial : DeviceSystemStatus, // Accelerometer etc...
        sensors : DeviceSystemStatus, // Generic sensors such as barometer etc...

        controller : DeviceSystemStatus // Init controller through WiFi
    };

    readonly router ?: DeviceSystemStatus; // WiFi High Range Router
    readonly server ?: DeviceSystemStatus; // Socket server
};
