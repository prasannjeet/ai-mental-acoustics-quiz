package com.prasannjeet.aima.controller;

import com.prasannjeet.aima.dto.ProblemDTO;
import com.prasannjeet.aima.dto.QuizDataDTO;
import com.prasannjeet.aima.dto.UserRecordingDTO;
import com.prasannjeet.aima.jpa.entity.FifFile;
import com.prasannjeet.aima.jpa.entity.QuizData;
import com.prasannjeet.aima.jpa.entity.QuizData.Problem;
import com.prasannjeet.aima.jpa.repository.FifFileRepository;
import com.prasannjeet.aima.jpa.repository.QuizDataRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
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
public class QuizController {
  
  public final QuizDataRepository quizDataRepository;
  public final FifFileRepository fifFileRepository;

  public QuizController(QuizDataRepository quizDataRepository, FifFileRepository fifFileRepository) {
    this.quizDataRepository = quizDataRepository;
    this.fifFileRepository = fifFileRepository;
  }

  @CrossOrigin
  @PreAuthorize("hasRole('aima-admin')")
  @GetMapping("/status/check")
  public String status() {
    return "Working";
  }

  @PostMapping("/{userId}/quiz")
  @Transactional
  public ResponseEntity<Map<String, String>> saveQuizData(@PathVariable String userId, @RequestBody List<QuizDataDTO> quizData) {
    return saveOrUpdateQuizData(userId, quizData);
  }

  @PostMapping("/{userId}/fifUrl")
  @Transactional
  public ResponseEntity<Map<String, String>> saveFifUrl(@PathVariable String userId, @RequestBody Map<String, String> requestBody) {
    String fifUrl = requestBody.get("fifUrl");
    String imageUrl = requestBody.get("imageUrl");

    FifFile fifFile = fifFileRepository.findFifFileByUserId(userId).orElse(new FifFile());
    fifFile.setUserId(userId);
    fifFile.setFifUrl(fifUrl);
    fifFile.setImageUrl(imageUrl);

    try {
      fifFileRepository.save(fifFile);
      log.info("Fif file url saved successfully for user: {}", userId);
      Map<String, String> response = new HashMap<>();
      response.put("message", "Fif file url saved successfully");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Error saving fif file url for user: {}", userId, e);
      Map<String, String> response = new HashMap<>();
      response.put("error", e.getMessage() != null ? e.getMessage() : "Unknown error");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }

  @PreAuthorize("hasRole('aima-admin')")
  @GetMapping("/userRecordings")
  public List<UserRecordingDTO> getUserRecordings() {
    List<UserRecordingDTO> response = new ArrayList<>();

    // Fetch all unique user IDs
    List<String> userIds = quizDataRepository.findDistinctUserId();

    for (String userId : userIds) {
      UserRecordingDTO dto = new UserRecordingDTO();
      dto.setUser(userId);

      // Fetch audio URLs for the user
      List<String> audioUrls = quizDataRepository.findAudioUrlsByUserId(userId);
      dto.setRecordings(audioUrls);

      // Fetch FIF file and plot image URL for the user
      FifFile fifFile = fifFileRepository.findById(userId).orElse(null);
      if (fifFile != null) {
        dto.setFifFile(fifFile.getFifUrl());
        dto.setPlot(fifFile.getImageUrl());
      }

      response.add(dto);
    }

    return response;
  }

  private synchronized ResponseEntity<Map<String, String>> saveOrUpdateQuizData(String userId, List<QuizDataDTO> quizData) {
    log.info("Received data for user: {}", userId);
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
      log.error("Error saving data for user: {}", userId, e);
      response.put("error", e.getMessage() != null ? e.getMessage() : "Unknown error");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }

  private Problem convertProblemDTOtoProblem(ProblemDTO problemDTO) {
    Problem problem = new Problem();
    problem.setQuestionName(problemDTO.getQuestionName());
    problem.setQuestionType(problemDTO.getQuestionType());
    problem.setOptions(problemDTO.getOptions());
    problem.setTheAnswer(problemDTO.getAnswer());
    return problem;
  }
}
