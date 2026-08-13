const WS_URL = "ws://localhost:8000/ws";

export function connectWebSocket(
    onMessage,
    onStatusChange
) {

    let socket = null;
    let reconnectTimer = null;
    let manuallyClosed = false;


    function notifyStatus(status) {

        if (typeof onStatusChange === "function") {

            onStatusChange(status);

        }

    }


    function connect() {

        if (manuallyClosed) {
            return;
        }


        console.log(
            "🔌 Connecting to:",
            WS_URL
        );


        notifyStatus("connecting");


        try {

            socket = new WebSocket(WS_URL);

        } catch (error) {

            console.error(
                "❌ WebSocket creation failed:",
                error
            );

            notifyStatus("error");

            scheduleReconnect();

            return;
        }


        socket.onopen = () => {

            console.log(
                "✅ WebSocket connected"
            );

            notifyStatus("connected");

        };


        socket.onmessage = (event) => {

            try {

                const data =
                    JSON.parse(event.data);


                console.log(
                    "📡 WebSocket data:",
                    data
                );


                if (
                    typeof onMessage === "function"
                ) {

                    onMessage(data);

                }

            } catch (error) {

                console.error(
                    "❌ Invalid WebSocket message:",
                    error
                );

            }

        };


        socket.onerror = (error) => {

            console.error(
                "❌ WebSocket error:",
                error
            );

            notifyStatus("error");

        };


        socket.onclose = (event) => {

            console.log(
                "🔌 WebSocket disconnected:",
                event.code,
                event.reason
            );


            notifyStatus("disconnected");


            scheduleReconnect();

        };

    }


    function scheduleReconnect() {

        if (manuallyClosed) {
            return;
        }


        if (reconnectTimer) {
            return;
        }


        reconnectTimer =
            setTimeout(() => {

                reconnectTimer = null;

                connect();

            }, 2000);

    }


    connect();


    return {

        close() {

            manuallyClosed = true;


            if (reconnectTimer) {

                clearTimeout(
                    reconnectTimer
                );

                reconnectTimer = null;

            }


            if (socket) {

                socket.close();

                socket = null;

            }

        },

    };

}