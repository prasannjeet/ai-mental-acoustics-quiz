package com.prasannjeet.aima.controller;

import com.prasannjeet.aima.dto.ProblemDTO;
import com.prasannjeet.aima.dto.QuizDataDTO;
import com.prasannjeet.aima.jpa.entity.QuizData;
import com.prasannjeet.aima.jpa.entity.QuizData.Problem;
import com.prasannjeet.aima.jpa.repository.QuizDataRepository;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
@Slf4j
public class TestController {
  
  public final QuizDataRepository quizDataRepository;

  public TestController(QuizDataRepository quizDataRepository) {
    this.quizDataRepository = quizDataRepository;
  }

  @CrossOrigin
  @PreAuthorize("hasRole('hastwitter')")
  @GetMapping("/status/check")
  public String status() {
    return "Working";
  }

  @PostMapping("/{userId}/quiz")
  @Transactional
  public ResponseEntity<Map<String, String>> saveQuizData(@PathVariable String userId, @RequestBody List<QuizDataDTO> quizData) {
    log.info("Received quiz data for user: {}", userId);
    Map<String, String> response = new HashMap<>();
    try {
      for (QuizDataDTO data : quizData) {
        QuizData quiz = new QuizData();
        quiz.setUserId(userId);
        quiz.setQuestion(convertProblemDTOtoProblem(data.getQuestion()));
        quiz.setAnswer(data.getAnswer());
        quiz.setAudioUrl(data.getAudioUrl());
        quiz.setStartTimestamp(data.getStartTimestamp());
        quiz.setEndTimestamp(data.getEndTimestamp());
        quizDataRepository.save(quiz);
      }
      response.put("message", "Data received successfully");
      log.info("Quiz data saved successfully for user: {}", userId);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Error saving quiz data for user: {}", userId, e);
      response.put("error", e.getMessage() != null ? e.getMessage() : "Unknown error");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }
  
  private Problem convertProblemDTOtoProblem(ProblemDTO problemDTO) {
    Problem problem = new Problem();
    problem.setQuestionName(problemDTO.getQuestionName());
    problem.setQuestionType(problemDTO.getQuestionType());
    problem.setOptions(problemDTO.getOptions());
    problem.setAnswer(problemDTO.getAnswer());
    return problem;
  }
}
