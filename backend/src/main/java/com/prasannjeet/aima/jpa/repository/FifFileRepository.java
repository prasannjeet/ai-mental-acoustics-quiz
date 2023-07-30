package com.prasannjeet.aima.jpa.repository;

import java.util.Optional;

import com.prasannjeet.aima.jpa.entity.FifFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FifFileRepository extends JpaRepository<FifFile, String> {
  Optional<FifFile> findFifFileByUserId(String userId);
}
