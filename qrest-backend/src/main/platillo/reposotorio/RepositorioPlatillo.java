package dev.srnj.qrest.platillo.repositorio;

import dev.srnj.qrest.platillo.entidades.Platillo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioPlatillo extends JpaRepository<Platillo, Long> {
    List<Platillo> findByCategoriaId(Long categoriaId);
    List<Platillo> findByDisponibleTrue();
}