package dev.srnj.qrest.controller;

import dev.srnj.qrest.dto.*;
import dev.srnj.qrest.entity.Role;
import dev.srnj.qrest.entity.User;
import dev.srnj.qrest.repository.UserRepository;
import dev.srnj.qrest.security.JwtUtils;
import dev.srnj.qrest.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils,
                          UserRepository userRepository, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtUtils.generateJwtToken(userDetails.getUsername());
        List<String> roles = userDetails.getAuthorities().stream().map(a -> a.getAuthority()).toList();

        return ResponseEntity.ok(new LoginResponse(token, userDetails.getUsername(), roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya existe");
        }
        User u = userService.createUser(request.getUsername(), request.getPassword(), Set.of(Role.ROLE_USER));
        return ResponseEntity.ok(Map.of("username", u.getUsername(), "id", u.getId()));
    }
}
