package com.example.demo.dto.rule;

import com.example.demo.entity.enums.ActionType;
import com.example.demo.entity.enums.Operator;

import lombok.Data;

@Data
public class CreateRuleRequest {
    private String name;
    private Operator operator;
    private double threshold;
    private ActionType actionType;
}
