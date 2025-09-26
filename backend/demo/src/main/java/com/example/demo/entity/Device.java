package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "devices")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String deviceId; // ID định danh duy nhất, ví dụ: "dev_abc123"

    @Column(nullable = false)
    private String name; // Tên do người dùng đặt, ví dụ: "Cảm biến phòng khách"

    @Column(nullable = false, unique = true)
    private String secretKey; // Mã bí mật để xác thực

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Bỏ qua trường này khi chuyển thành JSON để tránh lặp vô hạn
    @ToString.Exclude // Bỏ qua trong hàm toString để tránh lặp
    private User user;

}