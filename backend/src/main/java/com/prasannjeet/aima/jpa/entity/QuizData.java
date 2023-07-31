package com.prasannjeet.aima.jpa.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.Data;

@Entity
@IdClass(QuizDataKey.class)
@Data
public class QuizData {

  @Id
  private String userId;
  
  @Id
  private Long questionId;

  private String answer;

  private String audioUrl;

  private String startTimestamp;

  private String endTimestamp;

}
