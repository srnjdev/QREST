package dev.srnj.qrest.restaurante.repositorio;

import dev.srnj.qrest.restaurante.entidades.Restaurante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioRestaurante extends JpaRepository<Restaurante, Long> {
    Optional<Restaurante> findByCodigoQr(String codigoQr);
}