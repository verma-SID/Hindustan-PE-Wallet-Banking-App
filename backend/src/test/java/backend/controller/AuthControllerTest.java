package backend.controller;

import backend.entity.Transaction;
import backend.entity.User;
import backend.entity.UserCurrentBalance;
import backend.model.*;
import backend.service.UserService;
import jakarta.mail.MessagingException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


@SpringBootTest
public class AuthControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterUser() {
        RegistrationRequest registrationRequest = new RegistrationRequest("a@a", "a");

        doNothing().when(userService).registerUser(registrationRequest);

        ResponseEntity<String> response = authController.registerUser(registrationRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).registerUser(registrationRequest);
    }


    @Test
    public void testLoginUser() {
        LoginRequest loginRequest = new LoginRequest("a@a", "a");
        User mockUser = new User();
        when(userService.loginUser(loginRequest)).thenReturn(mockUser);

        ResponseEntity<User> response = authController.loginUser(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockUser, response.getBody());
        verify(userService, times(1)).loginUser(loginRequest);
    }

    @Test
    public void testLogout() {    
        ResponseEntity<String> response = authController.logout();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User LoggedOut Successfully", response.getBody());
    }

    @Test
    public void testWalletRecharge() {
        RechargeRequest rechargeRequest = new RechargeRequest("a@a", 100.0);
        doNothing().when(userService).rechargeWallet(rechargeRequest);

        ResponseEntity<String> response = authController.walletRecharge(rechargeRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).rechargeWallet(rechargeRequest);
    }

    // @Test
    // public void testTransferAmount() {
    //     TransferRequest transferRequest = new TransferRequest("a@a", "b@b", 100.0,"");
    //     doNothing().when(userService).transferAmount(transferRequest);

    //     ResponseEntity<String> response = authController.transferAmount(transferRequest);

    //     assertEquals(HttpStatus.OK, response.getStatusCode());
    //     verify(userService, times(1)).transferAmount(transferRequest);
    // }

    @Test
    public void testGetAccountStatement() throws MessagingException, IOException {
        List<TransactionResponse> mockAccountStatement = new ArrayList<>();
        when(userService.getAccountStatement("a@a")).thenReturn(mockAccountStatement);

        ResponseEntity<List<TransactionResponse>> response = authController.getAccountStatement("a@a");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockAccountStatement, response.getBody());
        verify(userService, times(1)).getAccountStatement("a@a");
    }

    @Test
    public void testGetUserDetails() {
        User mockUser = new User();
        when(userService.getUserDetails("a@a")).thenReturn(mockUser);

        ResponseEntity<User> response = authController.getUserDetails("a@a");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockUser, response.getBody());
        verify(userService, times(1)).getUserDetails("a@a");
    }

    @Test
    public void testGetCurrentBalance() {
        UserCurrentBalance mockBalance = new UserCurrentBalance();
        when(userService.getWalletBalance("a@a")).thenReturn(mockBalance);

        ResponseEntity<UserCurrentBalance> response = authController.getCurrentBalance("a@a");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockBalance, response.getBody());
        verify(userService, times(1)).getWalletBalance("a@a");
    }

    @Test
    public void testEarnCashback() {
        CashbackRequest cashbackRequest = new CashbackRequest("a@a", 100.0);
        doNothing().when(userService).earnCashback(cashbackRequest);

        ResponseEntity<String> response = authController.earnCashback(cashbackRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).earnCashback(cashbackRequest);
    }

    @Test
    public void testGetCashbackList() {
        List<Transaction> mockCashbacks = new ArrayList<>();
        when(userService.getCashbackList("a@a")).thenReturn(mockCashbacks);

        ResponseEntity<List<Transaction>> response = authController.getCashbackList("a@a");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockCashbacks, response.getBody());
        verify(userService, times(1)).getCashbackList("a@a");
    }
}
