package com.example.demo.service;

import com.example.demo.entity.SensorData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendDataUpdate(SensorData data) {
        // Gửi dữ liệu đến kênh "/topic/data"
        messagingTemplate.convertAndSend("/topic/data", data);
    }
}