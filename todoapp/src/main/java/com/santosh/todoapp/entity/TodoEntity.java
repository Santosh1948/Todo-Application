package com.santosh.todoapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_todoapp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TodoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private boolean completed = false;
}