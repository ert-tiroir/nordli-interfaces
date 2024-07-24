import React, { useEffect, useState } from "react";
import { Alert } from "../api/alert/event.ts";
import { MAX_ALERT_VIEW } from "./config.ts";
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, QuestionMarkCircleIcon, ShieldExclamationIcon, WrenchScrewdriverIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AlertViewProps {
    alert: Alert;
}

export function AlertIcon (props: AlertViewProps) {
    const { alert } = props;

    const COMMON = "w-6 h-6";

    if (alert.isCritical ()) return <ShieldExclamationIcon   className={ `${COMMON} text-red-500` }></ShieldExclamationIcon>
    if (alert.isDanger   ()) return <XCircleIcon             className={ `${COMMON} text-orange-500` }></XCircleIcon>
    if (alert.isWarning  ()) return <ExclamationTriangleIcon className={ `${COMMON} text-yellow-500` }></ExclamationTriangleIcon>
    if (alert.isInfo     ()) return <InformationCircleIcon   className={ `${COMMON} text-blue-500` }></InformationCircleIcon>
    if (alert.isDebug    ()) return <WrenchScrewdriverIcon   className={ `${COMMON} text-gray-500` }></WrenchScrewdriverIcon>
    if (alert.isSuccess  ()) return <CheckCircleIcon         className={ `${COMMON} text-green-500` }></CheckCircleIcon>

    return <QuestionMarkCircleIcon className={ `${COMMON} text-gray-500` }></QuestionMarkCircleIcon>
}

export function AlertView (props: AlertViewProps) {
    const { alert } = props;

    return <div className="w-full max-w-96 w-96 bg-white p-4 flex shadow-lg ring-1 ring-gray-900/5 rounded-lg">
        <div className="w-6">
            <AlertIcon alert={alert}></AlertIcon>
        </div>
        <div className="ml-3 flex-1">
            <div className="text-gray-900 text-sm">
                { alert.getTitle() }
            </div>
            <div className="text-gray-500 text-sm">
                { alert.getMessage() }
            </div>
        </div>
        <div className="ml-3 w-6">
            <XMarkIcon className="w-6 h-6 text-gray-400"></XMarkIcon>
        </div>
    </div>
}

export function AlertContainer () {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect( () => {
        const subscriptionId = rocket.subscribe(
            rocketEventsList.alert,
            (alert: Alert) => {
                console.log(alert);
                const newList: Alert[] = [];
                newList.push(...alerts);
                newList.push(alert);
                console.log(alerts, newList, alert)
    
                setAlerts(newList);
            }
        );

        return () => rocket.unsubscribe(subscriptionId);
    }, [ alerts ] );

    const inViewAlerts = alerts.filter( (_value: Alert, index: number) => index < MAX_ALERT_VIEW );
    inViewAlerts.reverse();
    console.log(inViewAlerts);

    return <div className="absolute w-full h-full pointer-events-none flex p-4">
        <div className="flex-1"></div>
        <div className="flex flex-col gap-y-4">
            <div className="flex-1"></div>
            {
                inViewAlerts.map(
                    (alert: Alert, index: number) => <AlertView key={index} alert={alert}/>
                )
            }
        </div>
    </div>
};
