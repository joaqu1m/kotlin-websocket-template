package com.example.kotlinws.service

import com.example.kotlinws.dto.MensagemDto
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@Service
class MensagemService(
    private val template: SimpMessagingTemplate
) {

    fun sendMessage(mensagem: MensagemDto) {
        template.convertAndSend("/mensagem", mensagem)
    }

    fun sendMessageTo(chatId: String, mensagem: MensagemDto) {
        val destination = "/mensagem/$chatId"
        template.convertAndSend(destination, mensagem)
    }

}