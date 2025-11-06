package dev.srnj.qrest.categoria.repositorio;

import dev.srnj.qrest.categoria.entidades.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioCategoria extends JpaRepository<Categoria, Long> {
    List<Categoria> findByRestauranteId(Long restauranteId);
}