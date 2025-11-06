package dev.srnj.qrest.repository;

import dev.srnj.qrest.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {

    List<Dish> findByActiveTrue();

    Optional<Dish> findByIdAndActiveTrue(Long id);

    List<Dish> findByCategoryIdAndActiveTrue(Long categoryId);

    List<Dish> findByActiveTrueAndAvailableTrue();

    @Query("SELECT d FROM Dish d WHERE d.active = true AND d.category.id = :categoryId ORDER BY d.name")
    List<Dish> findActiveDishesInCategory(@Param("categoryId") Long categoryId);
}
