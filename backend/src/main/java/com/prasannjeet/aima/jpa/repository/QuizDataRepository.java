package com.prasannjeet.aima.jpa.repository;


import com.prasannjeet.aima.jpa.entity.QuizData;
import com.prasannjeet.aima.jpa.entity.QuizDataKey;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizDataRepository extends JpaRepository<QuizData, QuizDataKey> {

  @Query("select distinct q.audioUrl from QuizData q where q.userId = ?1")
  List<String> findDistinctAudioUrlByUserId(String userId);

  @Query("select distinct q.userId from QuizData q")
  List<String> findDistinctUserId();
  
  @Query("select q from QuizData q where q.userId = ?1")
  List<QuizData> findByUserId(String userId);
  
}
