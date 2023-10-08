package backend.exception;

public class InvalidEmailFormatException extends RuntimeException{
    public InvalidEmailFormatException(String s){
        super(s);
    }
}
