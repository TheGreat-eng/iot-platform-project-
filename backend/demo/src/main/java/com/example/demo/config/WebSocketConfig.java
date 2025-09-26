package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // "/topic" là tiền tố cho các kênh mà client sẽ lắng nghe
        config.setApplicationDestinationPrefixes("/app"); // Tiền tố cho các message gửi từ client đến server
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // "/ws" là endpoint mà client sẽ kết nối tới WebSocket server
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000").withSockJS();
    }
}