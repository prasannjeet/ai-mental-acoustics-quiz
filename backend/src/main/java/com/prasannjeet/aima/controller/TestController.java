package com.prasannjeet.aima.controller;

import com.prasannjeet.aima.dto.QuizDataDTO;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @PostMapping("/{userId}")
  public ResponseEntity<?> saveQuizData(@PathVariable String userId, @RequestBody List<QuizDataDTO> quizData) {
    // Here, you would typically save the quiz data to your database.
    // For now, let's just print it to the console.
    for (QuizDataDTO data : quizData) {
      System.out.println("User ID: " + userId);
      System.out.println("Question: " + data.getQuestion().getQuestionName());
      System.out.println("Answer: " + data.getAnswer());
      System.out.println("Audio: " + Arrays.toString(data.getAudio()));
    }

    return ResponseEntity.ok().build();
  }
}
