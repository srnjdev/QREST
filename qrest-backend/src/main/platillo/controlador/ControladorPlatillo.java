package dev.srnj.qrest.platillo.controlador;

import dev.srnj.qrest.platillo.entidades.Platillo;
import dev.srnj.qrest.platillo.repositorio.RepositorioPlatillo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/platillos")
public class ControladorPlatillo {
    
    @Autowired
    private RepositorioPlatillo repositorioPlatillo;

    @GetMapping
    public List<Platillo> obtenerTodosLosPlatillos() {
        return repositorioPlatillo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Platillo> obtenerPlatilloPorId(@PathVariable Long id) {
        Optional<Platillo> platillo = repositorioPlatillo.findById(id);
        return platillo.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Platillo crearPlatillo(@RequestBody Platillo platillo) {
        return repositorioPlatillo.save(platillo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Platillo> actualizarPlatillo(@PathVariable Long id, @RequestBody Platillo detallesPlatillo) {
        Optional<Platillo> platillo = repositorioPlatillo.findById(id);
        if (platillo.isPresent()) {
            Platillo platilloExistente = platillo.get();
            platilloExistente.setNombre(detallesPlatillo.getNombre());
            platilloExistente.setDescripcion(detallesPlatillo.getDescripcion());
            platilloExistente.setPrecio(detallesPlatillo.getPrecio());
            platilloExistente.setImagenUrl(detallesPlatillo.getImagenUrl());
            platilloExistente.setDisponible(detallesPlatillo.getDisponible());
            return ResponseEntity.ok(repositorioPlatillo.save(platilloExistente));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPlatillo(@PathVariable Long id) {
        if (repositorioPlatillo.existsById(id)) {
            repositorioPlatillo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
