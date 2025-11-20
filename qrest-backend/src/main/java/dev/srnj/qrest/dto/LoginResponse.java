package dev.srnj.qrest.dto;

import java.util.List;

public class LoginResponse {
    private String token;
    private String username;
    private List<String> roles;

    public LoginResponse(String token, String username, List<String> roles) {
        this.token = token;
        this.username = username;
        this.roles = roles;
    }

    // getters
    public String getToken() { return token; }
    public String getUsername() { return username; }
    public List<String> getRoles() { return roles; }
}
