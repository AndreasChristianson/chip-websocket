import {useEffect, useState} from 'react'
import {apiKey, wssUrl} from "../env-vars.js";

export const App = () => {
    const [messages, setMessages] = useState([]);
    const [websocket, setWebsocket] = useState(null)
    const [resetRequestTime, setResetRequestTime] = useState(Date.now())
    const [userMessage, setUserMessage] = useState("")
    const [wsState, setWsState] = useState("na")

    const updateWsState = (ws) =>  {
        if (!ws) {
            setWsState("na")
        }else if (ws.readyState === WebSocket.OPEN) {
            setWsState("open")
        }else if (ws.readyState === WebSocket.CLOSED) {
            setWsState("closed")
        }else if (ws.readyState === WebSocket.CLOSING) {
            setWsState("closing")
        }else {
            setWsState("unknown")
        }
    }

    useEffect(() => {
        const intervalId = setInterval(()=> updateWsState(websocket),1000)
        return () => {
            clearInterval(intervalId);
        }
    }, [websocket]);

    const addMessage = (source, message) => {
        setMessages((prevMessages) => [...prevMessages, {
            source,
            message,
            timeStamp: Date.now(),
        }]);
    }
    const sendMessage = () => {
        websocket.send(JSON.stringify({
            userMessage,
        }));
            addMessage("self", userMessage);
            setUserMessage("")
    }
    const resetWs = () => {
        addMessage("system", "reset ws connection");
        setResetRequestTime(Date.now())
    }

    useEffect(() => {
        const url = `wss://${wssUrl}/production/?x-api-key=${apiKey}`;
        const ws = new WebSocket(url);

        ws.onopen = () => {
            addMessage("system", "WebSocket connected.")
        };

        ws.onmessage = (event) => {
            addMessage("other user", event.data)
        };

        ws.onclose = () => {
            addMessage("system", "WebSocket disconnected.")
        };

        ws.onerror = (error) => {
            addMessage("error", JSON.stringify(error))
        };
        setWebsocket(ws)
    }, [resetRequestTime]);

    return <>
        <h1>Websocket Chat</h1>
        <div>state {wsState}</div>
        <div><button onClick={resetWs}>reset</button></div>
        <div>
            <span>Send Message:</span>
            <input
                type="text"
                value={userMessage}
                onChange={(event) => {setUserMessage(event.target.value);}}
                placeholder="Type something..."
            />
            <button onClick={sendMessage}>send</button>
        </div>
        <div>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {message.timeStamp} - {message.source}: {message.message}
                    </li>
                ))}
            </ul>
        </div>
    </>;
}
