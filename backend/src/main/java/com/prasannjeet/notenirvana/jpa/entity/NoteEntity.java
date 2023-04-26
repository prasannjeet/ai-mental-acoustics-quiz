package com.prasannjeet.notenirvana.jpa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Data
@NoArgsConstructor
public class NoteEntity {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)", insertable = false, updatable = false, nullable = false)
    private String id;

    private String userId;

    private String title;

    @Lob
    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
        public void onPrePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void onPreUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public NoteEntity(String userId, String title, String content) {
        this.userId = userId;
        this.title = title;
        this.content = content;
    }
    
}
