package com.example.demo.repository;

import com.example.demo.entity.Device;
import com.example.demo.entity.Rule;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface RuleRepository extends JpaRepository<Rule, Long> {

    // PHƯƠNG THỨC MỚI: Tìm tất cả các quy tắc của một thiết bị cụ thể
    List<Rule> findByDevice(Device device);

    Rule findByName(String name);

    @Transactional
    void deleteByName(String name);
}
