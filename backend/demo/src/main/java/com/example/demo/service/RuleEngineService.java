package com.example.demo.service;

import com.example.demo.entity.Rule;
import com.example.demo.entity.SensorData;
import com.example.demo.entity.enums.ActionType;
import com.example.demo.repository.RuleRepository;
import com.example.demo.repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class RuleEngineService {
    @Autowired
    private RuleRepository ruleRepository;
    @Autowired
    private SensorDataRepository sensorDataRepository;
    @Autowired
    private EmailService emailService;

    // Thêm @Transactional để giữ session mở
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void evaluateRules() {
        System.out.println("Running rule engine evaluation...");
        List<Rule> rules = ruleRepository.findAll();

        for (Rule rule : rules) {
            // Lấy dữ liệu mới nhất của thiết bị
            List<SensorData> dataPoints = sensorDataRepository
                    .findByDeviceOrderByTimestampDesc(rule.getDevice());

            if (dataPoints.isEmpty()) {
                continue; // Bỏ qua nếu thiết bị chưa có dữ liệu
            }

            SensorData latestData = dataPoints.get(0);
            boolean conditionMet = false;

            // Kiểm tra điều kiện
            switch (rule.getOperator()) {
                case GREATER_THAN:
                    if (latestData.getValue() > rule.getThreshold()) {
                        conditionMet = true;
                    }
                    break;
                case LESS_THAN:
                    if (latestData.getValue() < rule.getThreshold()) {
                        conditionMet = true;
                    }
                    break;
            }

            // Nếu điều kiện đúng và chưa gửi mail trong 10 phút qua
            if (conditionMet && (rule.getLastTriggeredAt() == null ||
                    Duration.between(rule.getLastTriggeredAt(), Instant.now()).toMinutes() > 10)) {

                // Thực thi hành động
                if (rule.getActionType() == ActionType.SEND_EMAIL) {
                    String userEmail = rule.getDevice().getUser().getUsername();
                    String subject = "IoT Alert: Rule '" + rule.getName() + "' Triggered";
                    String text = "Alert for device '" + rule.getDevice().getName() + "':\n"
                            + "Value " + latestData.getValue() + " has triggered the rule '"
                            + rule.getName() + "' (Condition: " + rule.getOperator()
                            + " " + rule.getThreshold() + ").";
                    emailService.sendSimpleMail(userEmail, subject, text);
                }

                // Cập nhật thời gian kích hoạt
                rule.setLastTriggeredAt(Instant.now());
                ruleRepository.save(rule);
            }
        }
    }
}
