package com.example.demo.repository;

import com.example.demo.entity.Device;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    // Tìm các thiết bị thuộc về một người dùng cụ thể
    List<Device> findByUser(User user);

    // Phương thức quan trọng: Tìm thiết bị bằng cả deviceId VÀ secretKey để xác
    // thực
    Optional<Device> findByDeviceIdAndSecretKey(String deviceId, String secretKey);
}