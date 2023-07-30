package com.prasannjeet.aima.dto;

import java.util.List;

import lombok.Data;

@Data
public class UserRecordingDTO {
  private String user;
  private List<String> recordings;
  private String fifFile;
  private String plot;
}

