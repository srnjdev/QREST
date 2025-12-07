package dev.srnj.qrest.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private Set<String> roles;
    private boolean active;
}
