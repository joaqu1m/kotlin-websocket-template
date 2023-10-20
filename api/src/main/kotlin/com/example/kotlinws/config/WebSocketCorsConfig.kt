package com.example.kotlinws.config

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException

@Component
class WebSocketCorsConfig : OncePerRequestFilter() {

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        if (request.requestURI.contains("ws")) {
            response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"))
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            response.setHeader("Access-Control-Max-Age", "3600")
            response.setHeader("Access-Control-Allow-Headers", "authorization, content-type, xsrf-token")
            response.addHeader("Access-Control-Expose-Headers", "xsrf-token")
            response.setHeader("Access-Control-Allow-Credentials", "true")
            if ("OPTIONS" == request.method)
                response.status = HttpServletResponse.SC_OK
            else
                filterChain.doFilter(request, response)
        } else
            filterChain.doFilter(request, response)
    }
}
