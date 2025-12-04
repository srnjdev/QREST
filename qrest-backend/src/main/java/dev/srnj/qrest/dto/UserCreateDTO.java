package dev.srnj.qrest.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.util.Set;

@Data
public class UserCreateDTO {

    @NotBlank
    private String username;

    @NotBlank
    @Size(min = 1)
    private String password;

    private Set<String> roles;

    private boolean active = true;
}
