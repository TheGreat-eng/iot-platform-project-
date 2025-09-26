package com.example.demo.entity;

import com.example.demo.entity.enums.ActionType;
import com.example.demo.entity.enums.Operator;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "rules")
public class Rule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Operator operator; // >, <

    @Column(nullable = false)
    private double threshold; // Ngưỡng giá trị, ví dụ: 35.0

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType actionType; // SEND_EMAIL

    private Instant lastTriggeredAt;
}
