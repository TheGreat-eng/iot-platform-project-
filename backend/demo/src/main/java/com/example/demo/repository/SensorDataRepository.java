package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.SensorData;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {

}
