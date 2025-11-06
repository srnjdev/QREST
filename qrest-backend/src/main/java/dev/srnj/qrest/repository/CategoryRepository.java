package dev.srnj.qrest.repository;

import dev.srnj.qrest.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByActiveTrueOrderByDisplayOrderAsc();

    Optional<Category> findByIdAndActiveTrue(Long id);

    Optional<Category> findByName(String name);
}
