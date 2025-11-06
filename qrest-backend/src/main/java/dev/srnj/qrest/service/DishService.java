package dev.srnj.qrest.service;

import dev.srnj.qrest.dto.DishDTO;
import dev.srnj.qrest.entity.Category;
import dev.srnj.qrest.entity.Dish;
import dev.srnj.qrest.repository.CategoryRepository;
import dev.srnj.qrest.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DishService {

    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;

    public List<DishDTO> getAllDishes() {
        return dishRepository.findByActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DishDTO getDishById(Long id) {
        Dish dish = dishRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Dish not found with id: " + id));
        return convertToDTO(dish);
    }

    public List<DishDTO> getDishesByCategory(Long categoryId) {
        return dishRepository.findByCategoryIdAndActiveTrue(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DishDTO createDish(DishDTO dishDTO) {
        Long categoryId = dishDTO.getCategoryId();
        if (categoryId == null) {
            throw new RuntimeException("Category ID is required");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        Dish dish = new Dish();
        dish.setName(dishDTO.getName());
        dish.setDescription(dishDTO.getDescription());
        dish.setPrice(dishDTO.getPrice());
        dish.setCategory(category);
        dish.setImageUrl(dishDTO.getImageUrl());
        dish.setAvailable(dishDTO.getAvailable() != null ? dishDTO.getAvailable() : true);
        dish.setActive(true);
        dish.setAllergens(dishDTO.getAllergens());

        dish = dishRepository.save(dish);
        return convertToDTO(dish);
    }

    public DishDTO updateDish(Long id, DishDTO dishDTO) {
        Dish dish = dishRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Dish not found with id: " + id));

        if (dishDTO.getCategoryId() != null && !dishDTO.getCategoryId().equals(dish.getCategory().getId())) {
            Long categoryId = dishDTO.getCategoryId();
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            dish.setCategory(category);
        }

        dish.setName(dishDTO.getName());
        dish.setDescription(dishDTO.getDescription());
        dish.setPrice(dishDTO.getPrice());
        dish.setImageUrl(dishDTO.getImageUrl());
        dish.setAvailable(dishDTO.getAvailable());
        dish.setAllergens(dishDTO.getAllergens());

        dish = dishRepository.save(dish);
        return convertToDTO(dish);
    }

    public void deleteDish(Long id) {
        Dish dish = dishRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Dish not found with id: " + id));
        dish.setActive(false);
        dishRepository.save(dish);
    }

    private DishDTO convertToDTO(Dish dish) {
        DishDTO dto = new DishDTO();
        dto.setId(dish.getId());
        dto.setName(dish.getName());
        dto.setDescription(dish.getDescription());
        dto.setPrice(dish.getPrice());
        dto.setCategoryId(dish.getCategory().getId());
        dto.setCategoryName(dish.getCategory().getName());
        dto.setImageUrl(dish.getImageUrl());
        dto.setAvailable(dish.getAvailable());
        dto.setActive(dish.getActive());
        dto.setAllergens(dish.getAllergens());
        return dto;
    }
}
