package com.example.demo.controller;

import java.time.Instant;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Device;
import com.example.demo.entity.SensorData;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.repository.SensorDataRepository;
import com.example.demo.service.WebSocketService;

import lombok.Data;

@RestController
@RequestMapping("/api/device-data")
public class DeviceDataController {

    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private SensorDataRepository sensorDataRepository;
    @Autowired
    private WebSocketService webSocketService;

    // DTO để nhận dữ liệu từ Simulator
    @Data
    static class DeviceDataRequest {
        private String deviceId;
        private String secretKey;
        private double value;
    }

    @PostMapping
    public ResponseEntity<?> receiveDeviceData(@RequestBody DeviceDataRequest request) {
        // 1. Tìm thiết bị bằng deviceId VÀ secretKey
        Optional<Device> deviceOpt = deviceRepository.findByDeviceIdAndSecretKey(
                request.getDeviceId(), request.getSecretKey());

        if (deviceOpt.isEmpty()) {
            // 2. Nếu không tìm thấy hoặc key sai -> Trả về lỗi 403 Forbidden
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid deviceId or secretKey");
        }

        // 3. Nếu xác thực thành công, lưu dữ liệu
        Device device = deviceOpt.get();
        SensorData sensorData = new SensorData();
        sensorData.setDevice(device);
        sensorData.setValue(request.getValue());
        sensorData.setTimestamp(Instant.now());
        SensorData savedData = sensorDataRepository.save(sensorData);

        // 4. Gửi cập nhật qua WebSocket
        webSocketService.sendDataUpdateToUser(device.getUser().getUsername(), savedData);

        return ResponseEntity.ok("Data received");
    }
}