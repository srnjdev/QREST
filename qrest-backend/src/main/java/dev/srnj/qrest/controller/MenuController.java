package dev.srnj.qrest.controller;

import dev.srnj.qrest.dto.MenuDTO;
import dev.srnj.qrest.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuDTO>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDTO> getMenuById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }

    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<MenuDTO> getMenuByQrCode(@PathVariable String qrCode) {
        return ResponseEntity.ok(menuService.getMenuByQrCode(qrCode));
    }

    @PostMapping
    public ResponseEntity<MenuDTO> createMenu(@RequestBody MenuDTO menuDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.createMenu(menuDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuDTO> updateMenu(@PathVariable Long id, @RequestBody MenuDTO menuDTO) {
        return ResponseEntity.ok(menuService.updateMenu(id, menuDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{menuId}/dishes/{dishId}")
    public ResponseEntity<MenuDTO> addDishToMenu(@PathVariable Long menuId, @PathVariable Long dishId) {
        return ResponseEntity.ok(menuService.addDishToMenu(menuId, dishId));
    }

    @DeleteMapping("/{menuId}/dishes/{dishId}")
    public ResponseEntity<MenuDTO> removeDishFromMenu(@PathVariable Long menuId, @PathVariable Long dishId) {
        return ResponseEntity.ok(menuService.removeDishFromMenu(menuId, dishId));
    }
}
