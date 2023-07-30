package com.prasannjeet.aima.jpa.repository;


import com.prasannjeet.aima.jpa.entity.QuizData;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizDataRepository extends JpaRepository<QuizData, Long> {
  @Query("SELECT q.audioUrl FROM QuizData q WHERE q.userId = ?1")
  List<String> findAudioUrlsByUserId(String userId);

  @Query("SELECT DISTINCT q.userId FROM QuizData q")
  List<String> findDistinctUserId();
}
