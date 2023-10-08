package backend.service;

import backend.entity.Transaction;
import backend.entity.User;
import backend.entity.UserCurrentBalance;
import backend.exception.*;
import backend.model.*;
import backend.repository.TransactionRepository;
import backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private UserService userService;

    @Mock
    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        RegistrationRequest request = new RegistrationRequest("user@example.com", "password");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(null);

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword("hashedPassword");

        when(userRepository.save(any(User.class))).thenReturn(user);

        assertDoesNotThrow(() -> userService.registerUser(request));

        verify(userRepository, times(1)).findByEmail(request.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendMail(eq(request.getEmail()), anyString(), anyString());
    }

    @Test
    void testRegisterUser_UserAlreadyExists() {
        RegistrationRequest request = new RegistrationRequest("user@example.com", "password");
        when(userRepository.findByEmail(request.getEmail())).thenReturn(new User());

        assertThrows(UserAlreadyExistsException.class, () -> userService.registerUser(request));

        verify(userRepository, times(1)).findByEmail(request.getEmail());
        verify(userRepository, never()).save(any());
        verify(emailService, never()).sendMail(anyString(), anyString(), anyString());
    }

    @Test
    void testLoginUser_Success() {
        String email = "user@example.com";
        String password = "password";
        LoginRequest request = new LoginRequest(email, password);
        User user = new User();
        user.setEmail(email);
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        user.setPassword(hashedPassword);

        when(userRepository.findByEmail(email)).thenReturn(user);

        User loggedInUser = userService.loginUser(request);

        assertNotNull(loggedInUser);
        assertEquals(email, loggedInUser.getEmail());
    }

    @Test
    void testLoginUser_UserNotFound() {
        String email = "user@example.com";
        String password = "password";
        LoginRequest request = new LoginRequest(email, password);

        when(userRepository.findByEmail(email)).thenReturn(null);

        UserNotFoundException exception = assertThrows(UserNotFoundException.class,
                () -> userService.loginUser(request));

        assertEquals("User not found with this email", exception.getMessage());

        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void testRechargeWallet_Success() {
        RechargeRequest request = new RechargeRequest("user@example.com", 100.0);
        User user = new User();
        user.setEmail(request.getEmail());
        user.setWalletBalance(50.0);

        when(userRepository.findByEmail(request.getEmail())).thenReturn(user);
        when(transactionRepository.save(any())).thenReturn(new Transaction());

        assertDoesNotThrow(() -> userService.rechargeWallet(request));

        assertEquals(155.0, user.getWalletBalance());
    }

    @Test
    void testRechargeWallet_UserNotFound() {
        RechargeRequest request = new RechargeRequest("user@example.com", 100.0);

        when(userRepository.findByEmail(request.getEmail())).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> userService.rechargeWallet(request));

        verify(userRepository, times(1)).findByEmail(request.getEmail());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void testTransferAmount_Success() {
        String sourceEmail = "user1@example.com";
        String destinationEmail = "user2@example.com";
        double amount = 50.0;
        User sourceUser = new User();
        sourceUser.setEmail(sourceEmail);
        sourceUser.setWalletBalance(100.0);
        User destinationUser = new User();
        destinationUser.setEmail(destinationEmail);
        destinationUser.setWalletBalance(50.0);

        when(userRepository.findByEmail(sourceEmail)).thenReturn(sourceUser);
        when(userRepository.findByEmail(destinationEmail)).thenReturn(destinationUser);
        when(transactionRepository.save(any())).thenReturn(new Transaction());

        assertDoesNotThrow(
                () -> userService.transferAmount(new TransferRequest(sourceEmail, destinationEmail, amount,"")));

        assertEquals(50.0, sourceUser.getWalletBalance());
        assertEquals(100.0, destinationUser.getWalletBalance());

        verify(userRepository, times(1)).findByEmail(sourceEmail);
        verify(userRepository, times(1)).findByEmail(destinationEmail);
        verify(transactionRepository, times(2)).save(any());
    }

    @Test
    void testTransferAmount_UserNotFound() {
        String sourceEmail = "user1@example.com";
        String destinationEmail = "user2@example.com";
        double amount = 50.0;

        when(userRepository.findByEmail(sourceEmail)).thenReturn(null);
        when(userRepository.findByEmail(destinationEmail)).thenReturn(null);

        assertThrows(UserNotFoundException.class,
                () -> userService.transferAmount(new TransferRequest(sourceEmail, destinationEmail, amount,"")));

        verify(userRepository, times(1)).findByEmail(sourceEmail);
        verify(userRepository, times(1)).findByEmail(destinationEmail);
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void testTransferAmount_InsufficientBalance() {
        String sourceEmail = "user1@example.com";
        String destinationEmail = "user2@example.com";
        double amount = 150.0;
        User sourceUser = new User();
        sourceUser.setEmail(sourceEmail);
        sourceUser.setWalletBalance(100.0);
        User destinationUser = new User();
        destinationUser.setEmail(destinationEmail);
        destinationUser.setWalletBalance(50.0);

        when(userRepository.findByEmail(sourceEmail)).thenReturn(sourceUser);
        when(userRepository.findByEmail(destinationEmail)).thenReturn(destinationUser);

        assertThrows(InsufficientBalanceException.class,
                () -> userService.transferAmount(new TransferRequest(sourceEmail, destinationEmail, amount,"")));

        assertEquals(100.0, sourceUser.getWalletBalance());
        assertEquals(50.0, destinationUser.getWalletBalance());

        verify(userRepository, times(1)).findByEmail(sourceEmail);
        verify(userRepository, times(1)).findByEmail(destinationEmail);
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void testGenerateAccountStatementCSV() throws IOException, MessagingException {
        List<TransactionResponse> transactions = new ArrayList<>();
        transactions.add(
                new TransactionResponse("Debit", LocalDateTime.now(), 100.0, "user1@example.com", "user2@example.com"));

        File csvFile = userService.generateAccountStatementCSV(transactions);

        assertNotNull(csvFile);
        assertTrue(csvFile.exists());
        assertTrue(csvFile.length() > 0);

        csvFile.delete();
    }

    @Test
    void testGetCashbackList_Success() {
        String userEmail = "user@example.com";
        List<Transaction> cashbackTransactions = new ArrayList<>();
        cashbackTransactions.add(new Transaction("1", "Cashback", LocalDateTime.now(), 10.0, userEmail, userEmail,""));

        when(transactionRepository.findByUserEmailAndType(userEmail, "Cashback")).thenReturn(cashbackTransactions);

        List<Transaction> result = userService.getCashbackList(userEmail);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Cashback", result.get(0).getType());

        verify(transactionRepository, times(1)).findByUserEmailAndType(userEmail, "Cashback");
    }

    @Test
    void testGetCashbackList_UserNotFound() {
        String userEmail = "user@example.com";

        when(transactionRepository.findByUserEmailAndType(userEmail, "Cashback")).thenReturn(new ArrayList<>());

        assertThrows(UserNotFoundException.class, () -> userService.getCashbackList(userEmail));

        verify(transactionRepository, times(1)).findByUserEmailAndType(userEmail, "Cashback");
    }

    @Test
    void testGetAccountStatement_Success() throws MessagingException, IOException {
        String userEmail = "user@example.com";

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(new Transaction("1", "Debit", LocalDateTime.now(), 100.0, userEmail, userEmail,""));
        when(transactionRepository.findByMappedEmail(userEmail)).thenReturn(transactions);

        List<TransactionResponse> accountStatement = userService.getAccountStatement(userEmail);

        assertNotNull(accountStatement);
        assertEquals(1, accountStatement.size());
        assertEquals("Debit", accountStatement.get(0).getType());
    }

    @Test
    void testGetAccountStatement_UserNotFound() throws MessagingException, IOException {
        String userEmail = "user@example.com";

        when(transactionRepository.findByMappedEmail(userEmail)).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> userService.getAccountStatement(userEmail));

    }

    @Test
    void testMapTransactionToResponse() {
        Transaction transaction = new Transaction("1", "Debit", LocalDateTime.now(), 100.0, "user1@example.com",
                "user2@example.com","");

        TransactionResponse response = userService.mapTransactionToResponse(transaction);

        assertNotNull(response);
        assertEquals("Debit", response.getType());
        assertEquals(transaction.getLocalDateTime(), response.getLocalDateTime());
        assertEquals(transaction.getAmount(), response.getAmount());
        assertEquals(transaction.getUserEmail(), response.getUserEmail());
        assertEquals(transaction.getMappedEmail(), response.getMappedEmail());

    }

    @Test
    void testGetUserDetails() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setEmail(userEmail);

        when(userRepository.findByEmail(userEmail)).thenReturn(user);

        User userDetails = userService.getUserDetails(userEmail);

        assertNotNull(userDetails);
        assertEquals(userEmail, userDetails.getEmail());

    }

    @Test
    void testGetWalletBalance() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setEmail(userEmail);
        user.setWalletBalance(100.0);

        when(userRepository.findByEmail(userEmail)).thenReturn(user);

        UserCurrentBalance balance = userService.getWalletBalance(userEmail);

        assertNotNull(balance);
        assertEquals(100.0, balance.getAmount());

    }

    @Test
    void testEarnCashback_Success() {
        String userEmail = "user@example.com";
        double rechargeAmount = 100.0;
        User user = new User();
        user.setEmail(userEmail);

        when(userRepository.findByEmail(userEmail)).thenReturn(user);

        assertDoesNotThrow(() -> userService.earnCashback(new CashbackRequest(userEmail, rechargeAmount)));

        assertEquals(5.0, user.getWalletBalance());

    }

    @Test
    void testEarnCashback_UserNotFound() {
        String userEmail = "user@example.com";
        double rechargeAmount = 100.0;

        when(userRepository.findByEmail(userEmail)).thenReturn(null);

        assertThrows(UserNotFoundException.class,
                () -> userService.earnCashback(new CashbackRequest(userEmail, rechargeAmount)));

    }
}
