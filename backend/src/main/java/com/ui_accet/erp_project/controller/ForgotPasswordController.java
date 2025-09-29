package com.ui_accet.erp_project.controller;

import com.ui_accet.erp_project.model.User;
import com.ui_accet.erp_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class ForgotPasswordController {

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/forgot-password")
    public String resetPassword(@RequestBody User request) {
        Optional<User> userOpt = userRepo.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (user.getPassword().equals(request.getPassword())) {
                return "New password cannot be same as the old password";
            }

            user.setPassword(request.getPassword());
            userRepo.save(user);
            return "Password updated successfully";
        } else {
            return "User not found";
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPasswordByRegisterNumber(@RequestBody User request) {
        Optional<User> userOpt = userRepo.findByRegisterNumber(request.getRegisterNumber());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Check if new password is different from current password
            if (user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.badRequest().body("New password cannot be same as the old password");
            }

            // Update the password
            user.setPassword(request.getPassword());
            userRepo.save(user);

            System.out.println("Password reset successful for user: " + user.getRegisterNumber());
            return ResponseEntity.ok("Password updated successfully");
        } else {
            System.out.println("User not found for register number: " + request.getRegisterNumber());
            return ResponseEntity.status(404).body("User not found");
        }
    }
}