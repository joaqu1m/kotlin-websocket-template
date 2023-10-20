<script setup>
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { ref } from "vue";

var sock = new SockJS("http://localhost:8080/ws");

const stompClient = over(sock);
stompClient.debug = () => {};

const inputMensagem = ref("");
const mensagens = ref([]);

stompClient.connect({}, () => {
  stompClient.subscribe("/mensagem", ({ body }) => {
    mensagens.value.push(JSON.parse(body).mensagem);
  });
});

const sendMessage = () => {
  if (inputMensagem.value) {
    stompClient.send(
      "/app/mensagem",
      {},
      JSON.stringify({ mensagem: inputMensagem.value })
    );
    inputMensagem.value = "";
  }
};
</script>

<template>
  <div class="ws-main">
    <span>Chat</span>
    <div>
      <div v-for="(mensagem, i) in mensagens" :key="i">{{ mensagem }}</div>
    </div>
    <div>
      <input type="text" v-model="inputMensagem" @keydown.enter="sendMessage" />
      <button @click="sendMessage">Enviar mensagem</button>
    </div>
  </div>
</template>

<style lang="sass">
body
  margin: 0
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  background-color: #f3f4f6
  color-scheme: light dark
  color: rgba(255, 255, 255, 0.87)
  background-color: #242424
</style>
<style scoped lang="sass">
.ws-main
  width: 100%
  max-width: 600px
  padding: 1rem
  background-color: #fff
  border-radius: 0.5rem
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1)
  color: #242424
  text-align: center
  display: flex
  flex-direction: column
  gap: 16px
  >:nth-child(1)
    font-weight: bold
    font-size: 20px
  >:nth-child(2)
    width: 100%
    height: 300px
    overflow-y: scroll
    >div
      min-height: 40px
      display: flex
      justify-content: center
      align-items: center
      border: 1px solid black
  >:nth-child(3)
    display: flex
    flex-direction: column
</style>
