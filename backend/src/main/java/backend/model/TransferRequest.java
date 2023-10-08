package backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Email;
import javax.validation.constraints.Positive;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferRequest {
    @NotBlank(message = "Source email cannot be blank")
    @Email(message = "Invalid source email format")
    private String sourceEmail;

    @NotBlank(message = "Destination email cannot be blank")
    @Email(message = "Invalid destination email format")
    private String destinationEmail;

    @Positive(message = "Amount must be a positive number")
    private double amount;

    private String sourceVersion;
}
