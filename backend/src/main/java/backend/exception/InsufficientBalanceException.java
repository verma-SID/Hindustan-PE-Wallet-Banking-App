package backend.exception;

public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String insufficientBalanceForTransfer) {
        super(insufficientBalanceForTransfer);
    }
}
