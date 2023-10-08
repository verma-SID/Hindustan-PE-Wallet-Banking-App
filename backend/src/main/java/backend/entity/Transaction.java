package backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Entity
@Data
@Document(collection = "transactions")
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    @Id
    private String id;

    @NotBlank(message = "Transaction type is required")
    @Size(max = 255, message = "Transaction type cannot exceed 255 characters")
    private String type;

    @NotNull(message = "LocalDateTime is required")
    private LocalDateTime localDateTime;

    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be non-negative")
    private double amount;

    @NotBlank(message = "User email is required")
    private String userEmail;

    private String mappedEmail;

    private String transactionReference;
}
