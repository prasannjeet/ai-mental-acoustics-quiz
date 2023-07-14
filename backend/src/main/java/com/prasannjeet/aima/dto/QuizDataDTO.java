package com.prasannjeet.aima.dto;


import lombok.Data;

@Data
public class QuizDataDTO {
  private ProblemDTO question;
  private String answer;
  private String audioUrl;
  private String startTimestamp;
  private String endTimestamp;
}

