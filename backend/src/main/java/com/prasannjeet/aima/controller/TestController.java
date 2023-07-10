package com.prasannjeet.aima.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class TestController {
  @CrossOrigin
  @PreAuthorize("hasRole('hastwitter')")
  @GetMapping("/status/check")
  public String status() {
    return "Working";
  }
}
