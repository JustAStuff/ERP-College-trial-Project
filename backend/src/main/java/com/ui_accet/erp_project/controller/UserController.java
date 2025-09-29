package com.ui_accet.erp_project.controller;

import com.ui_accet.erp_project.model.User;
import com.ui_accet.erp_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails(@RequestParam String registerNumber) {
        System.out.println("Received registerNumber: '" + registerNumber + "'"); // for debugging
        Optional<User> userOpt = userRepo.findByRegisterNumber(registerNumber.trim()); // important: trim input

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        Optional<User> existingUser = userRepo.findByRegisterNumber(user.getRegisterNumber());

        if (existingUser.isPresent()) {
            User updatedUser = userRepo.save(user);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}