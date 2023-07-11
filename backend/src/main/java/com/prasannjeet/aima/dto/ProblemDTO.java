package com.prasannjeet.aima.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class ProblemDTO {
  private String questionName;
  private String questionType;
  private List<String> questionSequence;
  private Map<String, String> options;
  private String answer;

  // Getters and setters...
}

