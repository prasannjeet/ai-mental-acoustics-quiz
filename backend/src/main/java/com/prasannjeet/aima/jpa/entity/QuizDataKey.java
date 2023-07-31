package com.prasannjeet.aima.jpa.entity;

import java.io.Serializable;

import lombok.Data;

@Data
public class QuizDataKey implements Serializable {
  private String userId;
  private Long questionId;
}
