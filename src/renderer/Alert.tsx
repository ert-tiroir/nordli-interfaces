import React, { useEffect, useState } from "react";
import { Alert } from "../api/alert/event.ts";
import { MAX_ALERT_VIEW } from "./config.ts";
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, QuestionMarkCircleIcon, ShieldExclamationIcon, WrenchScrewdriverIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AlertViewProps {
    alert: Alert;
    close: () => void;
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

export function CloseIcon (props: AlertViewProps) {
    const { alert, close } = props;
    
    return (
        <button onClick={ close }>
            <XMarkIcon className="cursor-pointer w-6 h-6 text-gray-400 hover:text-gray-500 transition-all delay-50 duration-100"></XMarkIcon>
        </button>
    );
}

export function AlertCallbackView (props: AlertViewProps) {
    const { alert, close } = props;

    const callback = alert.getCallback();

    if (callback === undefined) return <div></div>;

    const COMMON = "rounded-md px-[10px] py-[6px] font-semibold transition-all delay-50 duration-100";

    return <div className="pt-4">
        <button onClick={() => { callback.callback(true); close(); }}
                className={ `${COMMON} text-white bg-indigo-600 hover:bg-indigo-500` }>
            { callback.acceptString }
        </button>

        <button onClick={() => { callback.callback(false); close(); }} 
                className={ `${COMMON} ml-3 bg-white ring-1 ring-gray-300 hover:bg-gray-100` }>
            { callback.declineString }
        </button>
    </div>
}

export function AlertView (props: AlertViewProps) {
    const { alert, close } = props;

    return <div className="pointer-events-auto w-full max-w-96 w-96 bg-white p-4 flex shadow-lg ring-1 ring-gray-900/5 rounded-lg">
        <div className="w-6">
            <AlertIcon alert={alert} close={close}></AlertIcon>
        </div>
        <div className="ml-3 flex-1">
            <div className="text-gray-900 text-sm">
                { alert.getTitle() }
            </div>
            <div className="text-gray-500 text-sm">
                { alert.getMessage() }
            </div>

            <AlertCallbackView alert={alert} close={close} />
        </div>
        <div className="ml-3 w-6">
            <CloseIcon alert={alert} close={close}></CloseIcon>
        </div>
    </div>
}

export function AlertContainer () {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect( () => {
        const subscriptionId = rocket.subscribe(
            rocketEventsList.alert,
            (alert: Alert) => {
                const newList: Alert[] = [];
                newList.push(...alerts);
                newList.push(alert);
    
                setAlerts(newList);
            }
        );

        return () => rocket.unsubscribe(subscriptionId);
    }, [ alerts ] );

    const inViewAlerts = alerts.filter( (_value: Alert, index: number) => index < MAX_ALERT_VIEW );
    inViewAlerts.reverse(); // IF CHANGED, CHANGE MAP

    return <div className="absolute w-full h-full pointer-events-none flex p-4 left-0 top-0">
        <div className="flex-1"></div>
        <div className="flex flex-col gap-y-4">
            <div className="flex-1"></div>
            {
                inViewAlerts.map(
                    (alert: Alert, index: number) => <AlertView key={index} alert={alert} close={ () => {
                        let trueIndex = inViewAlerts.length - 1 - index;
                        const newAlerts: Alert[] = [];
                        for (let i = 0; i < trueIndex; i ++) newAlerts.push(alerts[i]);
                        for (let i = trueIndex + 1; i < alerts.length; i ++)
                            newAlerts.push(alerts[i]);
                        setAlerts(newAlerts);
                    } }/>
                )
            }
        </div>
    </div>
};
