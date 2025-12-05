package dev.srnj.qrest.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.util.Set;

@Data
public class UserUpdateDTO {

    @NotBlank
    private String username;

    // opcional (solo si el usuario quiere cambiarla)
    private String password;

    private Set<String> roles;

    private boolean active;
}
