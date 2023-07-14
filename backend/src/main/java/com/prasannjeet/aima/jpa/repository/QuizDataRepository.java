package com.prasannjeet.aima.jpa.repository;

import com.prasannjeet.aima.jpa.entity.QuizData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizDataRepository extends JpaRepository<QuizData, Long> {
}
