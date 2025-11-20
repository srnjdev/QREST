package dev.srnj.qrest.service;

import dev.srnj.qrest.entity.User;
import dev.srnj.qrest.entity.Role;
import dev.srnj.qrest.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.*;
import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Used by Spring Security
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (u.getRoles() != null) {
            for(Role r : u.getRoles()){
                authorities.add(new SimpleGrantedAuthority(r.name()));
            }
        }

        // usamos la clase de Spring Security referenciándola por su FQCN
        return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                /* enabled */ true,
                /* accountNonExpired */ true,
                /* credentialsNonExpired */ true,
                /* accountNonLocked */ true,
                authorities);
    }

    @Transactional
    public User createUser(String username, String rawPassword, Set<Role> roles) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("username is required");
        }
        if (rawPassword == null || rawPassword.isEmpty()) {
            throw new IllegalArgumentException("password is required");
        }

        if(userRepository.existsByUsername(username)) throw new RuntimeException("Usuario ya existe");

        User u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRoles(roles != null ? roles : Collections.emptySet());
        return userRepository.save(u);
    }
}
