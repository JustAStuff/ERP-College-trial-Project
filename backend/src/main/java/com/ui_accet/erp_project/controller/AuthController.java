// AuthController.java
package com.ui_accet.erp_project.controller;

import com.ui_accet.erp_project.model.User;
import com.ui_accet.erp_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        // Debug logging
        System.out.println("=== SIGNUP DEBUG ===");
        System.out.println("Received user data: " + user);
        System.out.println("ABC ID: " + user.getABCid());
        System.out.println("ABC ID type: " + (user.getABCid() != null ? user.getABCid().getClass().getName() : "null"));

        // Validate required fields
        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
                user.getRegisterNumber() == null || user.getRegisterNumber().trim().isEmpty() ||
                user.getEmail() == null || user.getEmail().trim().isEmpty() ||
                user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            response.put("error", "All required fields must be filled");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate register number format (11 digits)
        if (!user.getRegisterNumber().matches("\\d{11}")) {
            response.put("error", "Register number must be exactly 11 digits");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate ABC ID format (12 digits with optional hyphens)
        if (user.getABCid() != null && !user.getABCid().replace("-", "").matches("\\d{12}")) {
            response.put("error", "ABC ID must be exactly 12 digits");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate Aadhar number format (12 digits with optional spaces)
        if (user.getAadharNumber() != null && !user.getAadharNumber().replace(" ", "").matches("\\d{12}")) {
            response.put("error", "Aadhar number must be exactly 12 digits");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate contact number format (10 digits)
        if (user.getContactNumber() != null && !user.getContactNumber().matches("\\d{10}")) {
            response.put("error", "Contact number must be exactly 10 digits");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> existingUser = userRepo.findByEmail(user.getEmail());
        Optional<User> existingRegisterNumber = userRepo.findByRegisterNumber(user.getRegisterNumber());

        if (existingUser.isPresent()) {
            response.put("exists", true);
            response.put("error", "User with this email already exists");
            return ResponseEntity.ok(response);
        } else if (existingRegisterNumber.isPresent()) {
            response.put("exists", true);
            response.put("error", "User with this register number already exists");
            return ResponseEntity.ok(response);
        } else {
            // Explicitly strip hyphens from ABCid before saving
            if (user.getABCid() != null) {
                user.setABCid(user.getABCid().replace("-", ""));
            }
            // Explicitly strip spaces from AadharNumber before saving
            if (user.getAadharNumber() != null) {
                user.setAadharNumber(user.getAadharNumber().replace(" ", ""));
            }

            // Debug: Print the user object before saving
            System.out.println("Saving user with ABC ID: " + user.getABCid());
            System.out.println("User object toString: " + user.toString());
            User savedUser = userRepo.save(user);
            System.out.println("Saved user ABC ID: " + savedUser.getABCid());
            System.out.println("Saved user object toString: " + savedUser.toString());
            System.out.println("=== END SIGNUP DEBUG ===");

            response.put("exists", false);
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> existingUser = userRepo.findByRegisterNumber(user.getRegisterNumber());

        if (existingUser.isPresent()) {
            User foundUser = existingUser.get();
            if (foundUser.getPassword().equals(user.getPassword())) {
                response.put("username", foundUser.getUsername());
                response.put("registerNumber", foundUser.getRegisterNumber());
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Invalid password");
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
    }
}