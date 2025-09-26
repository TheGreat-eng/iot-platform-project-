package com.example.demo.dto.device;

import lombok.Data;

@Data
public class CreateDeviceRequest {
    private String name; // Người dùng chỉ cần cung cấp tên cho thiết bị
}