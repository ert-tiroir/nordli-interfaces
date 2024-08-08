import { AdjustmentsVerticalIcon, BoltIcon, CpuChipIcon, CubeTransparentIcon, PhotoIcon, ServerIcon, ServerStackIcon, WifiIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { ConnectionStatus, NetworkStatus } from "../../../../api/network/status.ts";

import { NetworkChangedEvent, NetworkInitEvent } from "../../../../api/network/events.ts";
import { Device, DeviceStatus, DeviceSystemStatus } from "../../../../api/network/device.ts";

type ConnectionPathProps = { dashLength: number, path: string, connection: ConnectionStatus };
type ConnectionSVGProps  = { network: NetworkStatus };

type DeviceSystemViewerProps = {
    status : DeviceSystemStatus,
    Icon   : React.FunctionComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>>

    className?: string,
    colors ?: {
        online  ?: string,
        offline ?: string
    }
};
type DeviceViewerProps = { deviceName: string };

export function ConnectionPath (props: ConnectionPathProps) {
    const { path, connection } = props;
    let { dashLength } = props;
    
    let color = "black";
    if (connection == ConnectionStatus.ONLINE)       { color = "#34d399"; dashLength = 0; }
    if (connection == ConnectionStatus.RECONNECTING) { color = "#facc15"; }
    if (connection == ConnectionStatus.DISCONNECTED) { color = "#f87171"; }
    if (connection == ConnectionStatus.PENDING_INIT) { color = "#9ca3af"; }
    if (connection == ConnectionStatus.DETACHED)     { color = "#a5b4fc"; }

    return <path
        d={ path }
        stroke={ color }
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={ dashLength }
    />
}

export function ConnectionSVG (props: ConnectionSVGProps) {
    const { network } = props;

    return <svg width="80" height="160" viewBox="0 0 80 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ConnectionPath dashLength={4} path="M20 114V126" connection={ network.avionicsSPI } />
        <ConnectionPath dashLength={4} path="M34 140H48C54.6274 140 60 134.627 60 128V94" connection={ network.avionicsWiFi } />
        <ConnectionPath dashLength={4} path="M34 20H48C54.6274 20 60 25.3726 60 32V66" connection={ network.groundStationWiFi } />
        <ConnectionPath dashLength={4} path="M20 74V86" connection={ network.espWiFi } />
        <ConnectionPath dashLength={4} path="M20 34V46" connection={ network.groundStationSPI } />
    </svg>
}

export function ConnectionViewer () {
    const COMMON_ICON = "w-10 h-10 p-2"

    const [networkStatus, setNetworkStatus] = useState( NetworkStatus.defaultNetwork() );

    console.log(Device);
    rocket.subscribe( rocketEventsList.network.init, (event: NetworkInitEvent) => {
        setNetworkStatus( NetworkStatus.defaultNetwork() );
    } );
    rocket.subscribe( rocketEventsList.network.change, (event: NetworkChangedEvent) => {
        setNetworkStatus( event.networkStatus );
    } );

    // in order, main computer, Ground RPi, Ground ESP32, AV ESP32, AV RPi
    return <div className="relative w-20 h-40">
        <div className="absolute right-0 top-0">
            <div className="flex">    
                <div>
                    <ServerIcon  className={ `${COMMON_ICON}` }></ServerIcon>
                    <CpuChipIcon className={ `${COMMON_ICON}` }></CpuChipIcon>
                    <CpuChipIcon className={ `${COMMON_ICON}` }></CpuChipIcon>
                    <ServerIcon  className={ `${COMMON_ICON}` }></ServerIcon>
                </div>

                <div className="flex flex-col">
                    <div className="flex-1"></div>
                    <ComputerDesktopIcon className={ `${COMMON_ICON}` }></ComputerDesktopIcon>
                    <div className="flex-1"></div>
                </div>

                <div className="absolute w-full h-full">
                    <ConnectionSVG network={ networkStatus } />
                </div>
            </div>
        </div>
    </div>
}

export function DeviceSystemViewer (props: DeviceSystemViewerProps) {
    const { status, Icon } = props;

    let colors = props.colors;

    if (colors         === undefined) colors = {};
    if (colors.online  === undefined) colors.online  = "text-green-500";
    if (colors.offline === undefined) colors.offline = "text-gray-500";

    const { online, offline } = colors as any;

    let color = "";
    if (status == DeviceSystemStatus.ONLINE)  color = online;
    if (status == DeviceSystemStatus.OFFLINE) color = offline;

    let className = props.className;
    if (className === undefined) className = "w-6 h-6 m-2";

    return <Icon className={ `${className} ${color}` }></Icon>
}
export function DeviceViewer (props: DeviceViewerProps) {
    const { deviceName } = props;

    const deviceStatus: DeviceStatus = {
        powerOn: DeviceSystemStatus.OFFLINE,
        
        sensors: deviceName == "Raspberry Pi - Avionics" ? {
            sensors: DeviceSystemStatus.OFFLINE,
            camera : DeviceSystemStatus.ONLINE,
            spatial: DeviceSystemStatus.ONLINE,
            controller: DeviceSystemStatus.ONLINE
        } : undefined
    };

    const systems: React.JSX.Element[] = [];

    systems.push(<DeviceSystemViewer key="power" colors={
        { online: "text-amber-500", offline: "text-gray-500" }
    } status={ deviceStatus.powerOn } Icon={ BoltIcon } />)

    if (deviceStatus.sensors) {
        systems.push(<div key="sensors" className="w-10 h-10 flex">
            <div className="w-5 h-10">
                <DeviceSystemViewer className="w-3 h-3 m-1" status={ deviceStatus.sensors.spatial } Icon={ CubeTransparentIcon } />
                <DeviceSystemViewer className="w-3 h-3 m-1" status={ deviceStatus.sensors.sensors } Icon={ AdjustmentsVerticalIcon } />
            </div>
            <div className="w-5 h-10">
                <DeviceSystemViewer className="w-3 h-3 m-1" status={ deviceStatus.sensors.camera } Icon={ PhotoIcon } />
                <DeviceSystemViewer className="w-3 h-3 m-1" status={ deviceStatus.sensors.controller } Icon={ WrenchIcon } />
            </div>
        </div>)
    }

    if (deviceStatus.router) {
        systems.push(<DeviceSystemViewer key="router" status={ deviceStatus.router } Icon={ WifiIcon }/>)
    }
    if (deviceStatus.server) {
        systems.push(<DeviceSystemViewer key="server" status={ deviceStatus.server } Icon={ ServerStackIcon } />)
    }

    systems.reverse();

    return <div className="h-10 flex">
        <div>
            { deviceName }
        </div>

        <div className="flex-1"></div>

        { systems }
    </div>
}

export function ConnectionComponent () {
    return <div className="flex h-40 max-w-100">
        <div className="flex-1">
            <DeviceViewer deviceName="Raspberry Pi - Ground Station"/>
            <DeviceViewer deviceName="ESP32 - Ground Station"/>
            <DeviceViewer deviceName="ESP32 - Avionics"/>
            <DeviceViewer deviceName="Raspberry Pi - Avionics"/>
        </div>
        <ConnectionViewer />
    </div>
};
