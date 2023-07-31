package com.prasannjeet.aima.jpa.repository;

import java.util.Optional;

import com.prasannjeet.aima.jpa.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
  Optional<Question> findQuestionByQuestionNameAndQuestionType(String questionName, String questionType);

}
