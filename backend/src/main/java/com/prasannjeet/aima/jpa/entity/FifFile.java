package com.prasannjeet.aima.jpa.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
public class FifFile {

  @Id
  private String userId;
  private String fifUrl;
  private String imageUrl;
  private LocalDateTime startTime;
}
