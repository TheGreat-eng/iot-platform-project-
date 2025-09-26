package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.device.CreateDeviceRequest;
import com.example.demo.entity.Device;
import com.example.demo.entity.SensorData;
import com.example.demo.entity.User;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.service.DeviceService;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceService deviceService; // Chúng ta sẽ tạo Service này ở bước tiếp theo

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private com.example.demo.repository.SensorDataRepository sensorDataRepository;

    // API để tạo một thiết bị mới
    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody CreateDeviceRequest createDeviceRequest,
            Authentication authentication) {
        // Lấy thông tin user đang đăng nhập từ Spring Security
        User currentUser = (User) authentication.getPrincipal();
        Device newDevice = deviceService.createDevice(createDeviceRequest, currentUser);
        return new ResponseEntity<>(newDevice, HttpStatus.CREATED);
    }

    // API để lấy danh sách tất cả thiết bị của người dùng hiện tại
    @GetMapping
    public ResponseEntity<List<Device>> getUserDevices(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Device> devices = deviceService.getDevicesForUser(currentUser);
        return ResponseEntity.ok(devices);
    }

    // (Bạn có thể thêm API để xóa thiết bị sau)

    @GetMapping("/{deviceId}/data")
    public ResponseEntity<List<SensorData>> getDeviceData(
            @PathVariable Long deviceId,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

        // Tìm thiết bị trong CSDL
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);

        // Kiểm tra xem thiết bị có tồn tại và có thuộc về người dùng đang đăng nhập
        // không
        if (deviceOpt.isEmpty() || !deviceOpt.get().getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Không phải thiết bị của bạn
        }

        List<SensorData> data = sensorDataRepository.findByDeviceOrderByTimestampDesc(deviceOpt.get());
        return ResponseEntity.ok(data);
    }
}
