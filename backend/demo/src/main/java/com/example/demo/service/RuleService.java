package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.rule.CreateRuleRequest;
import com.example.demo.entity.Device;
import com.example.demo.entity.Rule;
import com.example.demo.entity.User;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.repository.RuleRepository;

@Service
public class RuleService {
    @Autowired
    private RuleRepository ruleRepository;
    @Autowired
    private DeviceRepository deviceRepository;

    // Phương thức này đã có
    public Rule createRule(Long deviceId, CreateRuleRequest request, User user) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        if (!device.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User does not have permission to create rule for this device");
        }

        Rule rule = new Rule();
        rule.setName(request.getName());
        rule.setDevice(device);
        rule.setOperator(request.getOperator());
        rule.setThreshold(request.getThreshold());
        rule.setActionType(request.getActionType());

        return ruleRepository.save(rule);
    }

    // PHƯƠNG THỨC MỚI: Lấy danh sách quy tắc của một thiết bị
    public List<Rule> getRulesForDevice(Long deviceId, User user) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        if (!device.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User does not have permission to view rules for this device");
        }
        return ruleRepository.findByDevice(device);
    }

    // PHƯƠNG THỨC MỚI: Xóa một quy tắc
    public void deleteRule(Long ruleId, User user) {
        Rule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Rule not found"));

        if (!rule.getDevice().getUser().getId().equals(user.getId())) {
            throw new SecurityException("User does not have permission to delete this rule");
        }
        ruleRepository.delete(rule);
    }
}