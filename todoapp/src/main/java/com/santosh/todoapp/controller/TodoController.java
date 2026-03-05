package com.santosh.todoapp.controller;

import com.santosh.todoapp.entity.TodoEntity;
import com.santosh.todoapp.repository.TodoRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class TodoController {

    private final TodoRepository repo;

    public TodoController(TodoRepository repo) {
        this.repo = repo;
    }

    @GetMapping({"/", "/home"})
    public String home(org.springframework.ui.Model model) {
        model.addAttribute("todos", repo.findAll());
        return "index";
    }

    @PostMapping("/todos")
    public String addTodo(@RequestParam String title) {
        if (title != null && !title.trim().isEmpty()) {
            TodoEntity t = new TodoEntity();
            t.setTitle(title.trim());
            t.setCompleted(false);
            repo.save(t);
        }
        return "redirect:/";
    }

    @PostMapping("/todos/{id}/toggle")
    public String toggle(@PathVariable Long id) {
        repo.findById(id).ifPresent(t -> {
            t.setCompleted(!t.isCompleted());
            repo.save(t);
        });
        return "redirect:/";
    }

    @PostMapping("/todos/{id}/delete")
    public String delete(@PathVariable Long id) {
        repo.deleteById(id);
        return "redirect:/";
    }
}