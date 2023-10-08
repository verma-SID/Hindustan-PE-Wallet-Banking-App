package backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

@Data
@AllArgsConstructor
public class CashbackRequest {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Recharge amount is required")
    @PositiveOrZero(message = "Recharge amount must be zero or positive")
    private double rechargeAmount;
}
