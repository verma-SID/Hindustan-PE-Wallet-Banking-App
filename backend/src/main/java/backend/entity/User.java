package backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Entity
@Getter
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 4, message = "Password must be at least 4 characters long")
    @NotBlank(message = "Password is required")
    private String password;

    private double walletBalance;

    @Version
    private Long version; // Version field for optimistic locking
}
