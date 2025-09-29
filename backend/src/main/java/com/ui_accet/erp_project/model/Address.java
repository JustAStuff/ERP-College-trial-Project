package com.ui_accet.erp_project.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {
    private String state;
    private String city;
    private String taluk;
    private String street;
    private String doorNo;
    private String pincode;

    public Address() {}

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getTaluk() { return taluk; }
    public void setTaluk(String taluk) { this.taluk = taluk; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getDoorNo() { return doorNo; }
    public void setDoorNo(String doorNo) { this.doorNo = doorNo; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}