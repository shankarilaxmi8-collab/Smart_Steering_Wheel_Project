const WS_URL = "ws://localhost:8000/ws";

export function connectWebSocket(onMessage) {

  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };


  socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    onMessage(data);

  };


  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };


  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };


  return socket;
}