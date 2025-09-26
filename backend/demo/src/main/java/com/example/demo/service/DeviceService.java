package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.device.CreateDeviceRequest;
import com.example.demo.entity.Device;
import com.example.demo.entity.User;
import com.example.demo.repository.DeviceRepository;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    public Device createDevice(CreateDeviceRequest request, User user) {
        Device device = new Device();
        device.setName(request.getName());
        device.setUser(user);

        // Tự động sinh ra các key duy nhất
        device.setDeviceId("dev_" + java.util.UUID.randomUUID().toString().replace("-", ""));
        device.setSecretKey("sk_" + java.util.UUID.randomUUID().toString().replace("-", ""));

        return deviceRepository.save(device);
    }

    public List<Device> getDevicesForUser(User user) {
        return deviceRepository.findByUser(user);
    }

    public Device getDeviceByIdAndUser(Long deviceId, User user) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found with id: " + deviceId));

        // KIỂM TRA QUYỀN SỞ HỮU - Rất quan trọng
        if (!device.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access Denied: You do not own this device.");
        }
        return device;
    }
}
