// User.java
package com.ui_accet.erp_project.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "register_number", unique = true, nullable = false, length = 11)
    private String registerNumber;

    private String username;
    private String year;
    private String branch;
    private String programme;
    private String studyMode;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dob;

    private String bloodGroup;

    @JsonProperty("abcid")
    @Column(name = "abc_id", length = 20)
    private String ABCid;

    @Embedded
    private Address address;

    private String contactNumber;
    private String aadharNumber;

    // New field for Aadhar document path
    @Column(name = "aadhar_document_path")
    private String aadharDocumentPath;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    public User() {}

    // Getters and setters for all fields below

    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getProgramme() { return programme; }
    public void setProgramme(String programme) { this.programme = programme; }

    public String getStudyMode() { return studyMode; }
    public void setStudyMode(String studyMode) { this.studyMode = studyMode; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getABCid() { return ABCid; }
    public void setABCid(String ABCid) { this.ABCid = ABCid; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAadharNumber() { return aadharNumber; }
    public void setAadharNumber(String aadharNumber) { this.aadharNumber = aadharNumber; }

    // Getter and Setter for aadharDocumentPath
    public String getAadharDocumentPath() { return aadharDocumentPath; }
    public void setAadharDocumentPath(String aadharDocumentPath) { this.aadharDocumentPath = aadharDocumentPath; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public String toString() {
        return "User{" +
                "registerNumber='" + registerNumber + '\'' +
                ", username='" + username + '\'' +
                ", year='" + year + '\'' +
                ", branch='" + branch + '\'' +
                ", programme='" + programme + '\'' +
                ", studyMode='" + studyMode + '\'' +
                ", dob=" + dob +
                ", bloodGroup='" + bloodGroup + '\'' +
                ", ABCid='" + ABCid + '\'' +
                ", address=" + address +
                ", contactNumber='" + contactNumber + '\'' +
                ", aadharNumber='" + aadharNumber + '\'' +
                ", aadharDocumentPath='" + aadharDocumentPath + '\'' + // Include in toString
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}