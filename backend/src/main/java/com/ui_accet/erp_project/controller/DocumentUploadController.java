// DocumentUploadController.java
package com.ui_accet.erp_project.controller;

import com.ui_accet.erp_project.model.User;
import com.ui_accet.erp_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/documents")
public class DocumentUploadController {

    // Define the directory where files will be stored
    // IMPORTANT: Make sure this directory exists and your application has write permissions
    private final String UPLOAD_DIR = "E:/paapal/Projects/erp_project/user_file_uploads";

    @Autowired
    private UserRepository userRepo;

    public DocumentUploadController() {
        // Ensure the upload directory exists when the controller is initialized
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
                System.out.println("Upload directory created: " + uploadPath.toAbsolutePath());
            } catch (IOException e) {
                System.err.println("Failed to create upload directory: " + uploadPath.toAbsolutePath() + " - " + e.getMessage());
                // Handle this error appropriately in a real application
            }
        }
    }

    @PostMapping("/uploadAadhar")
    public ResponseEntity<Map<String, String>> uploadAadhar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("registerNumber") String registerNumber) {

        Map<String, String> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("message", "Please select a file to upload.");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate file type (optional, but good practice)
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") &&
                !contentType.equals("image/png") &&
                !contentType.equals("application/pdf"))) {
            response.put("message", "Invalid file type. Only JPG, PNG, or PDF are allowed.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Find the user by register number
            Optional<User> userOpt = userRepo.findByRegisterNumber(registerNumber);
            if (userOpt.isEmpty()) {
                response.put("message", "User not found for the given register number.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User user = userOpt.get();

            // Get the file extension
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // Create the new filename using the register number
            String newFileName = registerNumber + "-aadhar" + fileExtension;
            Path filePath = Paths.get(UPLOAD_DIR, newFileName);

            // Save the file to the server
            Files.copy(file.getInputStream(), filePath);

            // Update the user's aadharDocumentPath in the database
            user.setAadharDocumentPath(newFileName);
            userRepo.save(user);

            response.put("message", "Aadhar document uploaded successfully!");
            response.put("filePath", newFileName);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println("File upload failed: " + e.getMessage());
            response.put("message", "Failed to upload file due to server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            System.err.println("An unexpected error occurred during file upload: " + e.getMessage());
            response.put("message", "An unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}