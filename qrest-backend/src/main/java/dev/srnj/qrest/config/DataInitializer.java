package dev.srnj.qrest.config;

import dev.srnj.qrest.entity.Category;
import dev.srnj.qrest.entity.Dish;
import dev.srnj.qrest.entity.Menu;
import dev.srnj.qrest.entity.Restaurant;
import dev.srnj.qrest.entity.Role;
import dev.srnj.qrest.service.QRCodeService;
import dev.srnj.qrest.service.UserService;
import dev.srnj.qrest.repository.CategoryRepository;
import dev.srnj.qrest.repository.DishRepository;
import dev.srnj.qrest.repository.MenuRepository;
import dev.srnj.qrest.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final DishRepository dishRepository;
    private final MenuRepository menuRepository;
    private final QRCodeService qrCodeService;
    private final UserService userService; // UserService (JPA) - Opción B

    @Override
    public void run(String... args) {
        // Inicializar datos base (restaurante, categorias, platos, menu) si no hay restaurantes
        if (restaurantRepository.count() == 0) {
            initializeData();
        }

        // Crear usuario admin en la BD (solo si no existe)
        try {
            userService.createUser("admin", "admin123", Set.of(Role.ROLE_ADMIN, Role.ROLE_USER));
            System.out.println("=================================");
            System.out.println("👤 Usuario administrador creado en BD: admin / admin123");
            System.out.println("=================================");
        } catch (Exception e) {
            // Si ya existe o hay error, lo ignoramos para no detener el arranque
        }
    }

    private void initializeData() {
        // Create Restaurant
        Restaurant restaurant = new Restaurant();
        restaurant.setName("Restaurante Demo");
        restaurant.setDescription("Restaurante de demostración para QREST");
        restaurant.setAddress("Calle Principal 123");
        restaurant.setPhone("+1234567890");
        restaurant.setEmail("demo@qrest.com");
        restaurant.setActive(true);
        restaurant = restaurantRepository.save(restaurant);

        // Create Categories
        Category appetizers = createCategory("Entradas", "Deliciosos aperitivos para comenzar", 1);
        Category mainCourses = createCategory("Platos Principales", "Nuestros mejores platos", 2);
        Category desserts = createCategory("Postres", "Dulces tentaciones", 3);
        Category beverages = createCategory("Bebidas", "Refrescantes bebidas", 4);

        // Create Dishes - Entradas
        createDish("Ensalada César", "Lechuga fresca con aderezo César, crutones y parmesano",
                new BigDecimal("8.99"), appetizers, Arrays.asList("Gluten", "Lácteos"));
        createDish("Bruschetta", "Pan tostado con tomate fresco, albahaca y aceite de oliva",
                new BigDecimal("6.50"), appetizers, Arrays.asList("Gluten"));
        createDish("Sopa del Día", "Consulta con tu mesero",
                new BigDecimal("5.99"), appetizers, Arrays.asList());

        // Create Dishes - Platos Principales
        createDish("Pizza Margherita", "Tomate, mozzarella fresca y albahaca",
                new BigDecimal("12.99"), mainCourses, Arrays.asList("Gluten", "Lácteos"));
        createDish("Pasta Carbonara", "Pasta con salsa carbonara cremosa y panceta",
                new BigDecimal("14.50"), mainCourses, Arrays.asList("Gluten", "Lácteos", "Huevo"));
        createDish("Hamburguesa Clásica", "Carne de res, lechuga, tomate, cebolla y queso",
                new BigDecimal("11.99"), mainCourses, Arrays.asList("Gluten", "Lácteos"));
        createDish("Salmón a la Plancha", "Filete de salmón con vegetales asados",
                new BigDecimal("18.99"), mainCourses, Arrays.asList("Pescado"));

        // Create Dishes - Postres
        createDish("Tiramisú", "Clásico postre italiano con café y mascarpone",
                new BigDecimal("6.99"), desserts, Arrays.asList("Gluten", "Lácteos", "Huevo"));
        createDish("Helado Artesanal", "3 bolas de helado a elegir",
                new BigDecimal("5.50"), desserts, Arrays.asList("Lácteos"));
        createDish("Brownie con Helado", "Brownie de chocolate caliente con helado de vainilla",
                new BigDecimal("7.50"), desserts, Arrays.asList("Gluten", "Lácteos", "Huevo"));

        // Create Dishes - Bebidas
        createDish("Coca Cola", "Refresco 500ml",
                new BigDecimal("2.50"), beverages, Arrays.asList());
        createDish("Agua Mineral", "Agua con o sin gas",
                new BigDecimal("2.00"), beverages, Arrays.asList());
        createDish("Jugo Natural", "Naranja, manzana o piña",
                new BigDecimal("3.50"), beverages, Arrays.asList());
        createDish("Café Espresso", "Café italiano",
                new BigDecimal("2.50"), beverages, Arrays.asList());

        // Create Menu
        Menu menu = new Menu();
        menu.setName("Menú Principal");
        menu.setDescription("Nuestro menú completo con todos los platos disponibles");
        menu.setRestaurant(restaurant);

        String qrCode = qrCodeService.generateUniqueCode();
        menu.setQrCode(qrCode);

        String qrUrl = "http://localhost:4200/public-menu/" + qrCode;
        String qrImageBase64 = qrCodeService.generateQRCodeBase64(qrUrl);
        menu.setQrImageUrl(qrImageBase64);

        menu.setActive(true);

        // Add all dishes to menu
        menu.setDishes(dishRepository.findAll());

        menuRepository.save(menu);

        System.out.println("=================================");
        System.out.println("✅ DATOS INICIALES CREADOS");
        System.out.println("=================================");
        System.out.println("🏪 Restaurante: " + restaurant.getName());
        System.out.println("📋 Categorías: " + categoryRepository.count());
        System.out.println("🍽️  Platos: " + dishRepository.count());
        System.out.println("📱 Menús: " + menuRepository.count());
        System.out.println("🔑 QR Code: " + qrCode);
        System.out.println("🌐 URL: " + qrUrl);
        System.out.println("=================================");
    }

    private Category createCategory(String name, String description, int order) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setDisplayOrder(order);
        category.setActive(true);
        return categoryRepository.save(category);
    }

    private Dish createDish(String name, String description, BigDecimal price,
                            Category category, java.util.List<String> allergens) {
        Dish dish = new Dish();
        dish.setName(name);
        dish.setDescription(description);
        dish.setPrice(price);
        dish.setCategory(category);
        dish.setAvailable(true);
        dish.setActive(true);
        dish.setAllergens(allergens);
        return dishRepository.save(dish);
    }
}
