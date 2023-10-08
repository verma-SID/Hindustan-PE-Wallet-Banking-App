package backend.controller;

import backend.entity.Transaction;
import backend.entity.User;
import backend.entity.UserCurrentBalance;
import backend.model.*;
import backend.service.UserService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

@RestController
@AllArgsConstructor
public class AuthController {

    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<String> homePage() {
        return ResponseEntity.ok("HI");
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegistrationRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@Valid @RequestBody LoginRequest request) {
        User user = userService.loginUser(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("User LoggedOut Successfully");
    }

    @PostMapping("/wallet-recharge")
    public ResponseEntity<String> walletRecharge(@Valid @RequestBody RechargeRequest request) {
        userService.rechargeWallet(request);
        return ResponseEntity.ok("Wallet Recharged Successfully");
    }

    @PostMapping("/money-transfer")
    public ResponseEntity<String> transferAmount(@Valid @RequestBody TransferRequest request) throws InterruptedException {
        userService.transferAmount(request);
        return ResponseEntity.ok("Amount transferred Successfully");
    }

    @GetMapping("/{email}/transactions")
    public ResponseEntity<List<TransactionResponse>> getAccountStatement(@PathVariable String email)
            throws MessagingException, IOException {
        List<TransactionResponse> accountStatement = userService.getAccountStatement(email);
        return ResponseEntity.ok(accountStatement);
    }

    @GetMapping("/{email}/user-details")
    public ResponseEntity<User> getUserDetails(@PathVariable String email) {
        return new ResponseEntity<>(userService.getUserDetails(email), HttpStatus.OK);
    }

    @GetMapping("/{email}/current-balance")
    public ResponseEntity<UserCurrentBalance> getCurrentBalance(@PathVariable String email) {
        return new ResponseEntity<>(userService.getWalletBalance(email), HttpStatus.OK);
    }

    @PostMapping("/earn")
    public ResponseEntity<String> earnCashback(@Valid @RequestBody CashbackRequest request) {
        userService.earnCashback(request);
        return ResponseEntity.ok("Cashback earned successfully");
    }

    @GetMapping("/user/{email}/cashbacks")
    public ResponseEntity<List<Transaction>> getCashbackList(@PathVariable String email) {
        List<Transaction> cashbacks = userService.getCashbackList(email);
        return ResponseEntity.ok(cashbacks);
    }

    @PostMapping("/{email}/send-account-statement")
    public ResponseEntity<String> sendAccountStatementByEmail(@PathVariable String email) {
        userService.sendAccountStatementOnMail(email);
        return ResponseEntity.ok("Account Statement sent to mail successfully");
    }
}
