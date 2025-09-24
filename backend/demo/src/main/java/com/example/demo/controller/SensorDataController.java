package com.example.demo.controller;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.SensorData;
import com.example.demo.repository.SensorDataRepository;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép React port 3000 gọi tới
public class SensorDataController {

    @Autowired
    private SensorDataRepository sensorDataRepository;

    // Endpoint để NHẬN dữ liệu từ thiết bị
    @PostMapping
    public ResponseEntity<SensorData> receiveData(@RequestBody SensorData data) {
        data.setTimestamp(Instant.now());
        SensorData savedData = sensorDataRepository.save(data);
        return ResponseEntity.ok(savedData);
    }

    // Endpoint để TRẢ dữ liệu cho trình duyệt
    @GetMapping
    public ResponseEntity<List<SensorData>> getAllData() {
        return ResponseEntity.ok(sensorDataRepository.findAll());
    }
}