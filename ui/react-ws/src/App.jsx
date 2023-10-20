import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { over } from 'stompjs';

const App = () => {
  const [inputMensagem, setInputMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);

  const sock = new SockJS("http://localhost:8080/ws");
  const stompClient = over(sock);
  stompClient.debug = () => {};

  useEffect(() => {
    stompClient.connect({}, () => {
      stompClient.subscribe("/mensagem", ({ body }) => {
        const receivedMessage = JSON.parse(body).mensagem;
        setMensagens((prevMensagens) => [...prevMensagens, receivedMessage]);
      });
    });
  }, []);

  const sendMessage = () => {
    if (inputMensagem) {
      stompClient.send(
        "/app/mensagem",
        {},
        JSON.stringify({ mensagem: inputMensagem })
      );
      setInputMensagem("");
    }
  };

  return (
    <div className="ws-main">
      <span>Chat</span>
      <div>
        {mensagens.map((mensagem, i) => (
          <div key={i}>{mensagem}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputMensagem}
          onChange={(e) => setInputMensagem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar mensagem</button>
      </div>
    </div>
  );
};

export default App;