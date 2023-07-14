package com.prasannjeet.aima.jpa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.Map;
import lombok.Data;

@Entity
@Data
public class QuizData {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  private String userId;

  @Embeddable
  @Data
  public static class Problem {
    private String questionName;
    private String questionType;

    @ElementCollection
    private Map<String, String> options;
    private String theAnswer;
  }

  @Embedded
  private Problem question;

  @Column
  private String answer;

  @Column
  private String audioUrl;

  @Column
  private String startTimestamp;

  @Column
  private String endTimestamp;

}
