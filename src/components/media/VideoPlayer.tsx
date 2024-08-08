
import React, { useEffect, useRef, useState } from "react";
import { Queue } from "../../utils/queue.ts";
import { VideoDataEvent, VideoEndEvent, VideoStartEvent } from "../../api/media/video/event";

const CODEC = 'video/mp4; codecs="avc1.64001e"';

export function subscribeToVideo (
        onStart: (event: VideoStartEvent) => void, 
        onData : (event: VideoDataEvent)  => void,
        onEnd  : (event: VideoEndEvent)   => void
    ) {
    const queue = new Queue<Buffer>();

    const onStartToken = rocket.subscribe( rocketEventsList.media.video.onStart, (event: VideoStartEvent) => {
        onStart(event);
    } );
    const onDataToken = rocket.subscribe( rocketEventsList.media.video.onData, (event: VideoDataEvent) => {
        queue.push(event.data);
        
        onData(event);
    } );
    const onEndToken = rocket.subscribe( rocketEventsList.media.video.onEnd, (event: VideoEndEvent) => {
        onEnd(event);
    } );

    return {
        unsubscribe: () => {
            rocket.unsubscribe( onStartToken );
            rocket.unsubscribe( onDataToken );
            rocket.unsubscribe( onEndToken );
        },
        queue: queue
    }
}

export function VideoPlayer () {
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useEffect ( () => {
        if (!videoRef.current) {
            rocket.alert.danger( "VideoPlayer Error", "No reference to the video player found" );
            return ;
        }
        if (!MediaSource.isTypeSupported(CODEC)) {
            rocket.alert.danger( "VideoPlayer Error", "Unsupported codec" );
            return ;
        }

        const source = new MediaSource();
        const url    = URL.createObjectURL(source);
        
        let opened = false;
        let alive  = true;

        let sourceBuffer: SourceBuffer | undefined = undefined;

        function restartOnData (time = 100) {
            setTimeout( onData, time );
        }
        function onData () {
            console.log("ON DATA")
            if (sourceBuffer === undefined) {
                restartOnData();
                return ;
            }

            console.log("FOUND SOURCE BUFFER")

            if (sourceBuffer.updating) {
                restartOnData(1);
                return ;
            }

            const fragment = queue.poll();

            console.log(fragment)

            sourceBuffer.appendBuffer(fragment.buffer);

            //if (videoRef.current) videoRef.current.play();
            
            if (queue.isEmpty()) return ;

            restartOnData();
        }

        const { unsubscribe, queue } = subscribeToVideo(
            (event: VideoStartEvent) => {
                console.log("On START");
            },
            onData,
            (event: VideoEndEvent) => {
                console.log("On END");
            }
        )

        source.addEventListener("sourceopen", () => {
            opened = true;

            console.log("SOURCE OPEN")
            sourceBuffer = source.addSourceBuffer(CODEC);
            sourceBuffer.addEventListener("update", () => { console.log("UPDATE !") })
            sourceBuffer.addEventListener("updatestart", () => { console.log("UPDATE START !") })
            sourceBuffer.addEventListener("updateend", () => { console.log("UPDATE END !") })
        });
        source.addEventListener("sourceclose", () => opened = false)
        source.addEventListener("sourceended", () => opened = false)

        videoRef.current.src = url;

        setTimeout(() => {
            if (opened || !alive) return ;

            rocket.alert.warning( "VideoPlayer", "Media Source did not open in 1 second." );
        }, 1000);

        return () => {
            alive = false;

            unsubscribe();
        }
    }, [] );

    return <video ref={videoRef} controls />
}
