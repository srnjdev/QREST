package dev.srnj.qrest.menu.controlador;

import dev.srnj.qrest.restaurante.entidades.Restaurante;
import dev.srnj.qrest.restaurante.repositorio.RepositorioRestaurante;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/public/menu")
public class ControladorMenuPublico {
    
    @Autowired
    private RepositorioRestaurante repositorioRestaurante;

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerMenuPorIdRestaurante(@PathVariable Long id) {
        Optional<Restaurante> restaurante = repositorioRestaurante.findById(id);
        if (restaurante.isPresent()) {
            return ResponseEntity.ok(restaurante.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/qr/{codigoQr}")
    public ResponseEntity<?> obtenerMenuPorQr(@PathVariable String codigoQr) {
        Optional<Restaurante> restaurante = repositorioRestaurante.findByCodigoQr(codigoQr);
        if (restaurante.isPresent()) {
            return ResponseEntity.ok(restaurante.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
