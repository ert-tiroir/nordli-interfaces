
export enum ConnectionStatus {
    ONLINE,
    RECONNECTING, 
    DISCONNECTED,

    PENDING_INIT,
    DETACHED
};

export class NetworkStatus {
    readonly avionicsSPI      : ConnectionStatus;
    readonly groundStationSPI : ConnectionStatus;

    readonly espWiFi : ConnectionStatus;

    readonly avionicsWiFi      : ConnectionStatus;
    readonly groundStationWiFi : ConnectionStatus;

    static defaultNetwork (): NetworkStatus {
        return {
            avionicsSPI       : ConnectionStatus.PENDING_INIT,
            groundStationSPI  : ConnectionStatus.PENDING_INIT,
            avionicsWiFi      : ConnectionStatus.PENDING_INIT,
            groundStationWiFi : ConnectionStatus.PENDING_INIT,
            espWiFi           : ConnectionStatus.PENDING_INIT
        }
    }
};
