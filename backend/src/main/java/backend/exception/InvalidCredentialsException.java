package backend.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String invalidCredentialsException) {
        super(invalidCredentialsException);
    }
}
