package com.prasannjeet.notenirvana.jpa.repository;

import java.util.List;
import java.util.Optional;

import com.prasannjeet.notenirvana.jpa.entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteEntityRepository extends JpaRepository<NoteEntity, String> {

    @Override
    NoteEntity save(NoteEntity note);

    // Delete note entity by note id
    void deleteById(String noteId);

    // Find one by id
    @Override
    Optional<NoteEntity> findById(String noteId);

    List<NoteEntity> findAllByUserId(String userId);
}
