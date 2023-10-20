package com.example.kotlinws.websocket

import com.example.kotlinws.dto.MensagemDto
import com.example.kotlinws.service.MensagemService
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class MensagemWsController(
    val mensagemService: MensagemService
) {

    @MessageMapping("/mensagem")
    fun sendMessage(
        @RequestBody mensagemDto: MensagemDto
    ) {
        mensagemService.sendMessage(mensagemDto)
    }

    @MessageMapping("/mensagem/{chatId}")
    fun sendMessageTo(
        @DestinationVariable chatId: String,
        @RequestBody mensagemDto: MensagemDto
    ) {
        mensagemService.sendMessageTo(chatId, mensagemDto)
    }
}