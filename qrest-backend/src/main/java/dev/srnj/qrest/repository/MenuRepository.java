package dev.srnj.qrest.repository;

import dev.srnj.qrest.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByActiveTrue();

    Optional<Menu> findByIdAndActiveTrue(Long id);

    Optional<Menu> findByQrCode(String qrCode);

    List<Menu> findByRestaurantIdAndActiveTrue(Long restaurantId);

    @Query("SELECT m FROM Menu m LEFT JOIN FETCH m.dishes WHERE m.qrCode = :qrCode AND m.active = true")
    Optional<Menu> findByQrCodeWithDishes(@Param("qrCode") String qrCode);
}
