package dev.srnj.qrest.service;

import dev.srnj.qrest.dto.DishDTO;
import dev.srnj.qrest.dto.MenuDTO;
import dev.srnj.qrest.entity.Dish;
import dev.srnj.qrest.entity.Menu;
import dev.srnj.qrest.entity.Restaurant;
import dev.srnj.qrest.repository.DishRepository;
import dev.srnj.qrest.repository.MenuRepository;
import dev.srnj.qrest.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuService {

    private final MenuRepository menuRepository;
    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final QRCodeService qrCodeService;

    @Value("${APP_BASE_URL}")
    private String baseUrl;

    public List<MenuDTO> getAllMenus() {
        return menuRepository.findByActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MenuDTO getMenuById(Long id) {
        Menu menu = menuRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + id));
        return convertToDTO(menu);
    }

    public MenuDTO getMenuByQrCode(String qrCode) {
        Menu menu = menuRepository.findByQrCodeWithDishes(qrCode)
                .orElseThrow(() -> new RuntimeException("Menu not found with QR code: " + qrCode));
        return convertToDTO(menu);
    }

    public MenuDTO createMenu(MenuDTO menuDTO) {
        Long restaurantId = menuDTO.getRestaurantId();
        if (restaurantId == null) {
            throw new RuntimeException("Restaurant ID is required");
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));

        Menu menu = new Menu();
        menu.setName(menuDTO.getName());
        menu.setDescription(menuDTO.getDescription());
        menu.setRestaurant(restaurant);
        menu.setActive(true);

        // Generate unique QR code
        String qrCode = qrCodeService.generateUniqueCode();
        while (menuRepository.findByQrCode(qrCode).isPresent()) {
            qrCode = qrCodeService.generateUniqueCode();
        }
        menu.setQrCode(qrCode);

        // Generate QR code image
        String qrUrl = baseUrl + "/public-menu/" + qrCode;
        String qrImageBase64 = qrCodeService.generateQRCodeBase64(qrUrl);
        menu.setQrImageUrl(qrImageBase64);

        menu = menuRepository.save(menu);
        return convertToDTO(menu);
    }

    public MenuDTO updateMenu(Long id, MenuDTO menuDTO) {
        Menu menu = menuRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + id));

        menu.setName(menuDTO.getName());
        menu.setDescription(menuDTO.getDescription());

        menu = menuRepository.save(menu);
        return convertToDTO(menu);
    }

    public void deleteMenu(Long id) {
        Menu menu = menuRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + id));
        menu.setActive(false);
        menuRepository.save(menu);
    }

    public MenuDTO addDishToMenu(Long menuId, Long dishId) {
        Menu menu = menuRepository.findByIdAndActiveTrue(menuId)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));

        Dish dish = dishRepository.findByIdAndActiveTrue(dishId)
                .orElseThrow(() -> new RuntimeException("Dish not found with id: " + dishId));

        if (!menu.getDishes().contains(dish)) {
            menu.getDishes().add(dish);
            menu = menuRepository.save(menu);
        }

        return convertToDTO(menu);
    }

    public MenuDTO removeDishFromMenu(Long menuId, Long dishId) {
        Menu menu = menuRepository.findByIdAndActiveTrue(menuId)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));

        menu.getDishes().removeIf(dish -> dish.getId().equals(dishId));
        menu = menuRepository.save(menu);

        return convertToDTO(menu);
    }

    private MenuDTO convertToDTO(Menu menu) {
        MenuDTO dto = new MenuDTO();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setDescription(menu.getDescription());
        dto.setRestaurantId(menu.getRestaurant().getId());
        dto.setRestaurantName(menu.getRestaurant().getName());
        dto.setQrCode(menu.getQrCode());
        dto.setQrImageUrl(menu.getQrImageUrl());
        dto.setActive(menu.getActive());

        List<DishDTO> dishes = menu.getDishes().stream()
                .filter(Dish::getActive)
                .map(this::convertDishToDTO)
                .collect(Collectors.toList());
        dto.setDishes(dishes);

        return dto;
    }

    private DishDTO convertDishToDTO(Dish dish) {
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
