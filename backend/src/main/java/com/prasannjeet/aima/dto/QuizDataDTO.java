package com.prasannjeet.aima.dto;


import lombok.Data;

@Data
public class QuizDataDTO {
  public String userId;
  public ProblemDTO question;
  public String answer;
  public byte[] audio;

  // Getters and setters...
}

