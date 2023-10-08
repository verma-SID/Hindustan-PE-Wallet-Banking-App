package backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
public class RegistrationRequest {
    @NotBlank(message = "Email cannot be blank")
    private String email;
    
    private String password;
}
