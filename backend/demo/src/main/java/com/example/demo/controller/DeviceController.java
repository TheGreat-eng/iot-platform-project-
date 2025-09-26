package com.example.demo.controller; // Giả sử package của bạn là com.example.demo

import com.example.demo.dto.device.CreateDeviceRequest;
import com.example.demo.entity.Device;
import com.example.demo.entity.SensorData; // <-- IMPORT THÊM
import com.example.demo.entity.User;
import com.example.demo.repository.SensorDataRepository; // <-- IMPORT THÊM
import com.example.demo.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // <-- IMPORT THÊM

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    // THÊM CÁC REPOSITORY CẦN THIẾT
    @Autowired
    private SensorDataRepository sensorDataRepository;

    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody CreateDeviceRequest createDeviceRequest,
            Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Device newDevice = deviceService.createDevice(createDeviceRequest, currentUser);
        return new ResponseEntity<>(newDevice, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getUserDevices(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Device> devices = deviceService.getDevicesForUser(currentUser);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable Long id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        try {
            Device device = deviceService.getDeviceByIdAndUser(id, currentUser);
            return ResponseEntity.ok(device);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    // ========================================================================
    // === PHƯƠNG THỨC CÒN THIẾU MÀ BẠN CẦN THÊM VÀO ===
    // ========================================================================
    @GetMapping("/{deviceId}/data")
    public ResponseEntity<List<SensorData>> getDeviceDataHistory(
            @PathVariable Long deviceId,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

        try {
            // 1. Dùng service đã có để lấy device và kiểm tra quyền sở hữu
            Device device = deviceService.getDeviceByIdAndUser(deviceId, currentUser);

            // 2. Nếu có quyền, dùng SensorDataRepository để lấy dữ liệu
            List<SensorData> data = sensorDataRepository.findByDeviceOrderByTimestampDesc(device);
            return ResponseEntity.ok(data);

        } catch (RuntimeException e) {
            // Nếu không tìm thấy device hoặc không có quyền, trả về lỗi
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }
    // ========================================================================
}