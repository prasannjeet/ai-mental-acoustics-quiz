package com.prasannjeet.aima.dto;

import java.util.List;
import lombok.Data;

@Data
public class UserResponseDTO {
  private String userId;
  private List<AudioDTO> audio;
  private String fifUrl;
  private String fifStartTime;
}

