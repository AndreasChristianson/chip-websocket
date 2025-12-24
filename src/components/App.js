import {useEffect, useState} from 'react'

export const App = () => {
    const [messages, setMessages] = useState([]);
    const [websocket, setWebsocket] = useState(null)
    const [resetRequestTime, setResetRequestTime] = useState(Date.now())
    const [userMessage, setUserMessage] = useState("")
    const [wsState, setWsState] = useState("na")
    const [wssUrl, setWssUrl] = useState("wss://echo.websocket.org")

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
    const sendMessage = (event) => {
        event.preventDefault();
        websocket.send(JSON.stringify({
            action: "sendmessage",
            message: userMessage,
        }));
            addMessage("self", userMessage);
            setUserMessage("")
    }
    const resetWs = (event) => {
        event.preventDefault();
        addMessage("system", `ws connection to ${wssUrl}`);
        setResetRequestTime(Date.now())
    }

    useEffect(() => {
        websocket&&websocket.close()
        const ws = new WebSocket(wssUrl);

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
        <form onSubmit={resetWs}>
            <input
                type="text"
                value={wssUrl}
                onChange={(event) => {setWssUrl(event.target.value);}}
                placeholder="wss://example.com"
            />
            <button type={"submit"}>connect/reconnect</button>
        </form>
        <form onSubmit={sendMessage}>
            <span>Send Message:</span>
            <input
                type="text"
                value={userMessage}
                onChange={(event) => {setUserMessage(event.target.value);}}
                placeholder="Type something..."
            />
            <button type={"submit"}>send</button>
        </form>
        <div>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {new Date(message.timeStamp).toLocaleDateString()} - {message.source}: {message.message}
                    </li>
                ))}
            </ul>
        </div>
    </>;
}
