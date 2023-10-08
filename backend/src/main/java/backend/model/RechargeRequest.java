package backend.model;

import javax.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RechargeRequest {
    private String email;

    @Positive(message = "Amount must be a positive number")
    private double amount;
}
