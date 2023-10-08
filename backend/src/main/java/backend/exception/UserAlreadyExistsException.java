package backend.exception;

public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String userAlreadyExists) {
        super(userAlreadyExists);
    }
}
