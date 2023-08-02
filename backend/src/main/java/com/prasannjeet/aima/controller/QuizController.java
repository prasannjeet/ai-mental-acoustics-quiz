package com.prasannjeet.aima.controller;

import com.prasannjeet.aima.dto.AudioDTO;
import com.prasannjeet.aima.dto.ProblemDTO;
import com.prasannjeet.aima.dto.QuizDataDTO;
import com.prasannjeet.aima.dto.UserRecordingDTO;
import com.prasannjeet.aima.dto.UserResponseDTO;
import com.prasannjeet.aima.jpa.entity.FifFile;
import com.prasannjeet.aima.jpa.entity.Question;
import com.prasannjeet.aima.jpa.entity.QuizData;
import com.prasannjeet.aima.jpa.repository.FifFileRepository;
import com.prasannjeet.aima.jpa.repository.QuestionRepository;
import com.prasannjeet.aima.jpa.repository.QuizDataRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class QuizController {
  
  private final QuizDataRepository quizDataRepository;
  private final FifFileRepository fifFileRepository;
  private final QuestionRepository questionRepository;

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

  private synchronized ResponseEntity<Map<String, String>> saveOrUpdateQuizData(String userId, List<QuizDataDTO> quizData) {
    log.info("Received data for user: {}", userId);
    Map<String, String> response = new HashMap<>();
    try {
      quizData.forEach(data -> quizDataRepository.save(convertQuizDataDTOToQuizData(userId, data)));
      response.put("message", "Data received successfully");
      log.info("Quiz data saved successfully for user: {}", userId);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Error saving data for user: {}", userId, e);
      response.put("error", e.getMessage() != null ? e.getMessage() : "Unknown error");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }

  @PostMapping("/{userId}/fifUrl")
  @Transactional
  public ResponseEntity<Map<String, String>> saveFifUrl(@PathVariable String userId, @RequestBody Map<String, String> requestBody) {
    String fifUrl = requestBody.get("fifUrl");
    String imageUrl = requestBody.get("imageUrl");
    LocalDateTime startTime = LocalDateTime.parse(requestBody.get("startTime")); // New line

    FifFile fifFile = fifFileRepository.findFifFileByUserId(userId).orElse(new FifFile());
    fifFile.setUserId(userId);
    fifFile.setFifUrl(fifUrl);
    fifFile.setImageUrl(imageUrl);
    fifFile.setStartTime(startTime); // New line

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
      List<String> audioUrls = quizDataRepository.findDistinctAudioUrlByUserId(userId);
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

  @PreAuthorize("hasRole('aima-admin')")
  @GetMapping("/analysisData")
  public ResponseEntity<List<UserResponseDTO>> getAnalysisData() {
    List<UserResponseDTO> response = new ArrayList<>();

    // Get all FifFiles
    List<FifFile> fifFiles = fifFileRepository.findAll();

    for (FifFile fifFile : fifFiles) {
      UserResponseDTO userResponseDTO = new UserResponseDTO();
      userResponseDTO.setUserId(fifFile.getUserId());
      userResponseDTO.setFifUrl(fifFile.getFifUrl());
      userResponseDTO.setFifStartTime(fifFile.getStartTime().toString());

      // Get QuizData for the user
      List<QuizData> quizDataList = quizDataRepository.findByUserId(fifFile.getUserId());
      List<AudioDTO> audioDTOs = quizDataList.stream()
          .map(qd -> new AudioDTO(qd.getQuestionId(), qd.getAudioUrl(), qd.getStartTimestamp()))
          .collect(Collectors.toList());

      userResponseDTO.setAudio(audioDTOs);

      response.add(userResponseDTO);
    }

    return ResponseEntity.ok(response);
  }

  private QuizData convertQuizDataDTOToQuizData(String userId, QuizDataDTO dto) {
    QuizData data = new QuizData();
    data.setUserId(userId);
    data.setQuestionId(getQuestionId(dto.getQuestion()));
    data.setAnswer(dto.getAnswer());
    data.setAudioUrl(dto.getAudioUrl());
    data.setStartTimestamp(dto.getStartTimestamp());
    data.setEndTimestamp(dto.getEndTimestamp());
    return data;
  }
  
  private Long getQuestionId(ProblemDTO problemDTO) {
    return questionRepository.findQuestionByQuestionNameAndQuestionType(problemDTO.getQuestionName(), problemDTO.getQuestionType())
        .orElseGet(() -> {
          Question question = new Question();
          question.setQuestionName(problemDTO.getQuestionName());
          question.setQuestionType(problemDTO.getQuestionType());
          question.setOptions(problemDTO.getOptions());
          questionRepository.save(question);
          return question;
        }).getId();
  }
  
}
