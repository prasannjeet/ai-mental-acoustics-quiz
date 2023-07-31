package com.prasannjeet.aima.jpa.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.Map;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Question {
  
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @EqualsAndHashCode.Include
  private String questionName;

  @EqualsAndHashCode.Include
  private String questionType;

  @ElementCollection
  private Map<String, String> options;
  
}
