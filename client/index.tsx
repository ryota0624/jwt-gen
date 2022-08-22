import * as React from "react";
import * as ReactDOM from 'react-dom/client';
import videojs from "video.js";

function simpleJwtEncode(payload: object) {
    const headerJSON = {
        algorithm: 'none',
        exp: Date.now() + 86400000, // NOTE: 1 day
    };


    const header = btoa(JSON.stringify(headerJSON))
    const claims = btoa(JSON.stringify(payload))
    return `${header}.${claims}.`
}   

function sign(payload: object) {    
    return simpleJwtEncode(payload)
}

function VideoJS(props: { src: string, jwtPayload: string }) {
    React.useEffect(() => {
        videojs("primary-video")
    }, [props.src])
    
    React.useEffect(() => {
        ((videojs as any).Hls.xhr.beforeRequest = ((request: any) => {
            const token = JSON.parse(props.jwtPayload)
            request.headers = {
              'Authorization': `Bearer ${sign(token)}`,
              ...request.headers
            }
            }
          )
        )
    }, [props.jwtPayload])
    return (
        <div className="h-56 flex flex-col space-y-2">
            <video
                id={"primary-video"}
                data-setup="{}"
                controls
                className="vjs-fill video-js vjs-default-skin vjs-big-play-centered"
            >
                <source src={props.src} type={"application/x-mpegURL"}></source>
            </video>
        </div>
    );
}

function VideoUrlInputForm() {
    const [inputtingUrl, setInputtingUrl] = React.useState<string | undefined>()
    const [confirmedUrl, setConfirmedUrl] = React.useState<string | undefined>()
    const [jwtPayloadJSON, setJwtPayloadJSON] = React.useState<string>(`{"sub": "you"}`)
    let validJwtPayloadJSON: boolean = true
    try {
        JSON.parse(jwtPayloadJSON)
    } catch {
        validJwtPayloadJSON = false
    }

    return <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jwt-payload">
                JwtPayload
            </label>
            {!validJwtPayloadJSON && <div className="bg-yellow-100 rounded-lg py-2 px-3 mb-4 text-base text-yellow-700 mb-3" role="alert">
                    A simple warning alert - check it out!
            </div>}
            <textarea
                value={jwtPayloadJSON}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jwt-payload"
                onChange={(e) => {
                    setJwtPayloadJSON(e.target.value)
                }}></textarea>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="video-src">
                Video URL
            </label>
            <input type={"text"}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="video-src"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setConfirmedUrl(inputtingUrl)
                    }
                }}
                onChange={(e) => {
                    setInputtingUrl(e.target.value)
                }}></input>
        </div>
        <div className="mb-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                setConfirmedUrl(inputtingUrl)
            }}>Load</button>
        </div>
        {
            validJwtPayloadJSON && jwtPayloadJSON && confirmedUrl && <VideoJS src={confirmedUrl} jwtPayload={jwtPayloadJSON}></VideoJS>
        }
    </div>
}


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <VideoUrlInputForm />
    </React.StrictMode>
);
