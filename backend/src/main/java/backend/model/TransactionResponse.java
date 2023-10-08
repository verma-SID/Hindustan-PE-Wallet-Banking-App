package backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TransactionResponse {
    private String type;
    private LocalDateTime localDateTime;
    private double amount;
    private String userEmail;
    private String mappedEmail;
}
