package dev.srnj.qrest.autenticacion.controlador;

import dev.srnj.qrest.usuario.entidades.Usuario;
import dev.srnj.qrest.usuario.repositorio.RepositorioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class ControladorAutenticacion {
    
    @Autowired
    private RepositorioUsuario repositorioUsuario;

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            if (repositorioUsuario.findByEmail(usuario.getEmail()).isPresent()) {
                Map<String, String> respuesta = new HashMap<>();
                respuesta.put("error", "El email ya está registrado");
                return ResponseEntity.badRequest().body(respuesta);
            }
            
            Usuario nuevoUsuario = repositorioUsuario.save(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("error", "Error al registrar usuario");
            return ResponseEntity.badRequest().body(respuesta);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> solicitudLogin) {
        try {
            String email = solicitudLogin.get("email");
            String password = solicitudLogin.get("password");
            
            Optional<Usuario> usuario = repositorioUsuario.findByEmail(email);
            
            if (usuario.isPresent() && usuario.get().getPassword().equals(password)) {
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Login exitoso");
                respuesta.put("usuario", usuario.get());
                return ResponseEntity.ok(respuesta);
            } else {
                Map<String, String> respuesta = new HashMap<>();
                respuesta.put("error", "Credenciales incorrectas");
                return ResponseEntity.status(401).body(respuesta);
            }
        } catch (Exception e) {
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("error", "Error en el login");
            return ResponseEntity.badRequest().body(respuesta);
        }
    }
}