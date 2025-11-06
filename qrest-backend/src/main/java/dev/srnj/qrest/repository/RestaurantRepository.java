package dev.srnj.qrest.repository;

import dev.srnj.qrest.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByActiveTrue();

    Optional<Restaurant> findByIdAndActiveTrue(Long id);

    Optional<Restaurant> findByEmail(String email);
}
