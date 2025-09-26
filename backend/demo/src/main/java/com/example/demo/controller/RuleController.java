package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.rule.CreateRuleRequest;
import com.example.demo.entity.Rule;
import com.example.demo.entity.User;
import com.example.demo.service.RuleService;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class RuleController {

    @Autowired
    private RuleService ruleService;

    // Endpoint đã có
    @PostMapping("/devices/{deviceId}/rules")
    public ResponseEntity<?> createRule(
            @PathVariable Long deviceId,
            @RequestBody CreateRuleRequest request,
            Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Rule newRule = ruleService.createRule(deviceId, request, currentUser);
            return new ResponseEntity<>(newRule, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // ENDPOINT MỚI: Lấy danh sách quy tắc
    @GetMapping("/devices/{deviceId}/rules")
    public ResponseEntity<?> getRulesForDevice(@PathVariable Long deviceId, Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            List<Rule> rules = ruleService.getRulesForDevice(deviceId, currentUser);
            return ResponseEntity.ok(rules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // ENDPOINT MỚI: Xóa một quy tắc
    @DeleteMapping("/rules/{ruleId}")
    public ResponseEntity<?> deleteRule(@PathVariable Long ruleId, Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            ruleService.deleteRule(ruleId, currentUser);
            return ResponseEntity.ok("Rule deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}