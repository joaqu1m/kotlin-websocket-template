import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";

const App = () => {
  const [inputMensagem1, setInputMensagem1] = useState("");
  const [mensagens1, setMensagens1] = useState([]);

  const [inputMensagem2, setInputMensagem2] = useState("");
  const [mensagens2, setMensagens2] = useState([]);

  const privateChatIdMock = "123";

  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS("http://localhost:8080/ws");
    const stomp = over(sock);
    stomp.debug = () => {};

    setStompClient(stomp);
  }, []);

  useEffect(() => {
    stompClient?.connect({}, () => {
      stompClient.subscribe("/mensagem", ({ body }) => {
        const receivedMessage = JSON.parse(body).mensagem;
        setMensagens1((prevMensagens) => [...prevMensagens, receivedMessage]);
      });
      stompClient.subscribe(`/mensagem/${privateChatIdMock}`, ({ body }) => {
        const receivedMessage = JSON.parse(body).mensagem;
        setMensagens2((prevMensagens) => [...prevMensagens, receivedMessage]);
      });
    });

    return () => {
      if (stompClient?.connected) {
        stompClient.disconnect();
      }
    };
  }, [stompClient]);

  const sendMessage1 = () => {
    if (inputMensagem1 && stompClient) {
      stompClient.send(
        "/app/mensagem",
        {},
        JSON.stringify({ mensagem: inputMensagem1 })
      );
      setInputMensagem1("");
    }
  };

  const sendMessage2 = () => {
    if (inputMensagem2 && stompClient) {
      stompClient.send(
        `/app/mensagem/${privateChatIdMock}`,
        {},
        JSON.stringify({ mensagem: inputMensagem2 })
      );
      setInputMensagem2("");
    }
  };

  return (
    <div className="ws-main">
      <div>
        <span>Chat geral</span>
        <div>
          {mensagens1.map((mensagem, i) => (
            <div key={i}>{mensagem}</div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={inputMensagem1}
            onChange={(e) => setInputMensagem1(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage1()}
          />
          <button onClick={sendMessage1}>Enviar mensagem</button>
        </div>
      </div>
      <div>
        <span>Chat privado</span>
        <div>
          {mensagens2.map((mensagem, i) => (
            <div key={i}>{mensagem}</div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={inputMensagem2}
            onChange={(e) => setInputMensagem2(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage2()}
          />
          <button onClick={sendMessage2}>Enviar mensagem</button>
        </div>
      </div>
    </div>
  );
};

export default App;