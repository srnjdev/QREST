package dev.srnj.qrest.service;

import dev.srnj.qrest.dto.UserCreateDTO;
import dev.srnj.qrest.dto.UserDTO;
import dev.srnj.qrest.dto.UserUpdateDTO;
import dev.srnj.qrest.entity.Role;
import dev.srnj.qrest.entity.User;
import dev.srnj.qrest.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * UserService: combina UserDetailsService (para Spring Security) y métodos CRUD para usuarios.
 */
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -----------------------
    // UserDetailsService (auth)
    // -----------------------
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (u.getRoles() != null) {
            for(Role r : u.getRoles()){
                // aseguramos que las autoridades usan el nombre del enum (ej: ROLE_ADMIN)
                authorities.add(new SimpleGrantedAuthority(r.name()));
            }
        }

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                /* enabled */ u.isActive(),
                /* accountNonExpired */ true,
                /* credentialsNonExpired */ true,
                /* accountNonLocked */ true,
                authorities);
    }

    // -----------------------
    // Mappers (Entity <-> DTO)
    // -----------------------
    private UserDTO toDto(User u) {
        if (u == null) return null;
        UserDTO d = new UserDTO();
        d.setId(u.getId());
        d.setUsername(u.getUsername());
        // convert Set<Role> -> Set<String>
        d.setRoles(u.getRoles() == null ? Collections.emptySet() :
                u.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
        d.setActive(u.isActive());
        return d;
    }

    private Set<Role> stringsToRoles(Set<String> roles) {
        if (roles == null) return Collections.emptySet();
        return roles.stream()
                .filter(Objects::nonNull)
                .map(s -> {
                    try {
                        return Role.valueOf(s);
                    } catch (IllegalArgumentException ex) {
                        // si la cadena no corresponde a un enum, podemos lanzar o ignorar; aquí lanzamos
                        throw new IllegalArgumentException("Invalid role: " + s);
                    }
                })
                .collect(Collectors.toSet());
    }

    // -----------------------
    // CRUD methods
    // -----------------------

    /**
     * Listado paginado de usuarios.
     */
    public Page<UserDTO> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toDto);
    }

    /**
     * Obtener 1 usuario por id.
     */
    public UserDTO findById(Long id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + id));
    }

    /**
     * Crear usuario a partir de DTO (codifica password).
     */
    @Transactional
    public UserDTO create(UserCreateDTO in) {
        if (in == null) throw new IllegalArgumentException("Input is null");
        if (in.getUsername() == null || in.getUsername().trim().isEmpty())
            throw new IllegalArgumentException("username is required");
        if (in.getPassword() == null || in.getPassword().isBlank())
            throw new IllegalArgumentException("password is required");

        if (userRepository.existsByUsername(in.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + in.getUsername());
        }

        User u = new User();
        u.setUsername(in.getUsername());
        u.setPassword(passwordEncoder.encode(in.getPassword()));
        Set<Role> roles = stringsToRoles(in.getRoles());
        // si roles vacío, asignar ROLE_USER por defecto
        if (roles.isEmpty()) roles = Set.of(Role.ROLE_USER);
        u.setRoles(roles);
        u.setActive(in.isActive());

        User saved = userRepository.save(u);
        return toDto(saved);
    }

    /**
     * Actualizar usuario por id. Si password viene vacía/null -> no se cambia.
     */
    @Transactional
    public UserDTO update(Long id, UserUpdateDTO in) {
        if (in == null) throw new IllegalArgumentException("Input is null");

        User u = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + id));

        if (in.getUsername() == null || in.getUsername().trim().isEmpty())
            throw new IllegalArgumentException("username is required");

        u.setUsername(in.getUsername());

        if (in.getPassword() != null && !in.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(in.getPassword()));
        }

        if (in.getRoles() != null) {
            u.setRoles(stringsToRoles(in.getRoles()));
        }

        u.setActive(in.isActive());

        User saved = userRepository.save(u);
        return toDto(saved);
    }

    /**
     * Eliminar usuario.
     */
    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NoSuchElementException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

    // -----------------------
    // Convenience method previously present: createUser (kept for compatibility)
    // -----------------------
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
        u.setActive(true);
        return userRepository.save(u);
    }
}
