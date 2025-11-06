package dev.srnj.qrest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuDTO {
    private Long id;
    private String name;
    private String description;
    private Long restaurantId;
    private String restaurantName;
    private String qrCode;
    private String qrImageUrl;
    private Boolean active;
    private List<DishDTO> dishes;
}
