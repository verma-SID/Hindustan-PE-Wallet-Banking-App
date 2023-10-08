package backend.service;

import com.opencsv.CSVWriter;

import backend.entity.Transaction;
import backend.entity.User;
import backend.entity.UserCurrentBalance;
import backend.model.CashbackRequest;
import backend.model.LoginRequest;
import backend.model.RechargeRequest;
import backend.model.RegistrationRequest;
import backend.model.TransactionResponse;
import backend.model.TransferRequest;
import backend.repository.TransactionRepository;
import backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.mindrot.jbcrypt.BCrypt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.UpdateDefinition;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import backend.exception.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.logging.Logger;

@Service
public class UserService {

    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MongoTemplate mongoTemplate;

    private final JavaMailSender javaMailSender;

    @Autowired
    public UserService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void registerUser(RegistrationRequest request) {

        String email = request.getEmail();
        String password = request.getPassword();

        if (userRepository.findByEmail(email) != null) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        if (!isValidEmail(email)) {
            throw new InvalidEmailFormatException("Invalid email format");
        }

        if (password.length() < 4) {
            throw new InvalidPasswordException("Password must be at least 4 characters long");
        }

        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

        User user = new User();
        user.setEmail(email);
        user.setPassword(hashedPassword);
        userRepository.save(user);

        emailService.sendMail(email, "Subject", "UserAdded");
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return email.matches(emailRegex);
    }

    public User loginUser(LoginRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            User user = userRepository.findByEmail(request.getEmail());
            if (BCrypt.checkpw(request.getPassword(), user.getPassword())) {
                return user;
            } else {
                throw new UserNotFoundException("Wrong Password");
            }
        }
        throw new UserNotFoundException("User not found with this email");
    }

    @Transactional
    public void rechargeWallet(RechargeRequest request) {
        String email = request.getEmail();
        double rechargeAmount = request.getAmount();
        User user = userRepository.findByEmail(email);

        if (user != null) {
            double currentBalance = user.getWalletBalance();
            user.setWalletBalance(currentBalance + rechargeAmount);

            Transaction transaction = new Transaction();
            transaction.setType("Recharge");
            transaction.setLocalDateTime(LocalDateTime.now());
            transaction.setAmount(rechargeAmount);
            transaction.setUserEmail(email);
            transaction.setMappedEmail(email);

            userRepository.save(user);
            transactionRepository.save(transaction);

            CashbackRequest cashbackRequest = new CashbackRequest(email, rechargeAmount);
            earnCashback(cashbackRequest);

        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    // @Transactional
    // public void transferAmount(TransferRequest request) throws
    // InterruptedException {
    // int maxRetries = 3;
    // int retries = 0;

    // while (retries < maxRetries) {
    // String sourceEmail = request.getSourceEmail();
    // String destinationEmail = request.getDestinationEmail();
    // double amount = request.getAmount();

    // User sourceUser = userRepository.findByEmail(sourceEmail);
    // User destinationUser = userRepository.findByEmail(destinationEmail);

    // if (sourceUser != null && destinationUser != null) {
    // double sourceBalance = sourceUser.getWalletBalance();

    // if (sourceBalance < amount) {
    // throw new InsufficientBalanceException("Insufficient balance for transfer");
    // } else {
    // try {
    // System.out.println("Source Before: " + getWalletBalance(sourceEmail));

    // sourceUser.setWalletBalance(sourceBalance - amount);
    // userRepository.save(sourceUser);
    // System.out.println("Source : " + getWalletBalance(sourceEmail));
    // System.out.println("Destination Before: " +
    // getWalletBalance(destinationEmail));

    // destinationUser.setWalletBalance(destinationUser.getWalletBalance() +
    // amount);

    // // Check if the source balance is sufficient
    // double updatedSourceBalance = sourceUser.getWalletBalance();
    // if (updatedSourceBalance < amount) {
    // throw new InsufficientBalanceException("Insufficient balance for the
    // transfer");
    // }

    // userRepository.save(destinationUser);
    // System.out.println("Destination : " + getWalletBalance(destinationEmail));

    // // Generate a unique transaction reference (e.g., using UUID)
    // String transactionReference = UUID.randomUUID().toString();

    // // Create transaction for sender (Debit)
    // Transaction transactionSender = new Transaction();
    // transactionSender.setAmount(amount);
    // transactionSender.setType("Debit");
    // transactionSender.setLocalDateTime(LocalDateTime.now());
    // transactionSender.setUserEmail(destinationEmail);
    // transactionSender.setMappedEmail(sourceEmail);
    // transactionSender.setTransactionReference(transactionReference);

    // // Create transaction for receiver (Credit)
    // Transaction transactionReceiver = new Transaction();
    // transactionReceiver.setAmount(amount);
    // transactionReceiver.setType("Credit");
    // transactionReceiver.setLocalDateTime(LocalDateTime.now());
    // transactionReceiver.setUserEmail(sourceEmail);
    // transactionReceiver.setMappedEmail(destinationEmail);
    // transactionReceiver.setTransactionReference(transactionReference);

    // // Save the transactions
    // transactionRepository.save(transactionSender);
    // transactionRepository.save(transactionReceiver);

    // return;
    // } catch (OptimisticLockingFailureException ex) {
    // retries++;
    // }
    // }
    // }
    // }

    // throw new UserNotFoundException("Source or Destination User not Found");
    // }

    // public void transferAmount(TransferRequest request) throws InterruptedException {
    //     int maxRetries = 3;
    //     int retries = 0;

    //     while (retries < maxRetries) {
    //         try {
    //             transferWithTransaction(request);
    //             return; // Successful transfer
    //         } catch (OptimisticLockingFailureException ex) {
    //             retries++;
    //         }
    //     }

    //     throw new UserNotFoundException("Source or Destination User not Found");
    // }

    // @Transactional
    // public void transferWithTransaction(TransferRequest request) throws InterruptedException {
    //     String threadName = Thread.currentThread().getName();
    //     System.out.println("Thread Name : " + threadName);

    //     String sourceEmail = request.getSourceEmail();
    //     String destinationEmail = request.getDestinationEmail();
    //     double amount = request.getAmount();

    //     User sourceUser = userRepository.findByEmail(sourceEmail);
    //     User destinationUser = userRepository.findByEmail(destinationEmail);

    //     if (sourceUser != null && destinationUser != null) {
    //         double sourceBalance = sourceUser.getWalletBalance();

    //         if (sourceBalance < amount) {
    //             throw new InsufficientBalanceException("Insufficient balance for transfer");
    //         } else {
    //             System.out.println("Source Before: " + getWalletBalance(sourceEmail));

    //             sourceUser.setWalletBalance(sourceBalance - amount);
    //             userRepository.save(sourceUser);
    //             System.out.println("Source : " + getWalletBalance(sourceEmail));
    //             System.out.println("Destination Before: " + getWalletBalance(destinationEmail));

    //             destinationUser.setWalletBalance(destinationUser.getWalletBalance() + amount);

    //             // Check if the source balance is sufficient
    //             double updatedSourceBalance = sourceUser.getWalletBalance();
    //             if (updatedSourceBalance < amount) {
    //                 throw new InsufficientBalanceException("Insufficient balance for the transfer");
    //             }

    //             userRepository.save(destinationUser);
    //             System.out.println("Destination : " + getWalletBalance(destinationEmail));

    //             // Generate a unique transaction reference (e.g., using UUID)
    //             String transactionReference = UUID.randomUUID().toString();

    //             // Create transaction for sender (Debit)
    //             Transaction transactionSender = new Transaction();
    //             transactionSender.setAmount(amount);
    //             transactionSender.setType("Debit");
    //             transactionSender.setLocalDateTime(LocalDateTime.now());
    //             transactionSender.setUserEmail(destinationEmail);
    //             transactionSender.setMappedEmail(sourceEmail);
    //             transactionSender.setTransactionReference(transactionReference);

    //             // Create transaction for receiver (Credit)
    //             Transaction transactionReceiver = new Transaction();
    //             transactionReceiver.setAmount(amount);
    //             transactionReceiver.setType("Credit");
    //             transactionReceiver.setLocalDateTime(LocalDateTime.now());
    //             transactionReceiver.setUserEmail(sourceEmail);
    //             transactionReceiver.setMappedEmail(destinationEmail);
    //             transactionReceiver.setTransactionReference(transactionReference);

    //             // Save the transactions
    //             transactionRepository.save(transactionSender);
    //             transactionRepository.save(transactionReceiver);

    //             return;
    //         }
    //     }

    //     throw new UserNotFoundException("Source or Destination User not Found");
    // }

    public void transferAmount(TransferRequest request) throws InterruptedException {
        int maxRetries = 3;
        int retries = 0;

        while (retries < maxRetries) {
            try {
                transferWithTransaction(request);
                return; // Successful transfer
            } catch (OptimisticLockingFailureException ex) {
                retries++;
            }
        }

        throw new UserNotFoundException("Source or Destination User not Found");
    }

    @Transactional
    public void transferWithTransaction(TransferRequest request) throws InterruptedException {
        String threadName = Thread.currentThread().getName();
        System.out.println("Thread Name : " + threadName);

        String sourceEmail = request.getSourceEmail();
        String destinationEmail = request.getDestinationEmail();
        double amount = request.getAmount();

        User sourceUser = userRepository.findByEmail(sourceEmail);
        User destinationUser = userRepository.findByEmail(destinationEmail);

        if (sourceUser != null && destinationUser != null) {
            double sourceBalance = sourceUser.getWalletBalance();

            if (sourceBalance < amount) {
                throw new InsufficientBalanceException("Insufficient balance for transfer");
            } else {
                sourceUser.setWalletBalance(sourceBalance - amount);
                userRepository.save(sourceUser);
                
                destinationUser.setWalletBalance(destinationUser.getWalletBalance() + amount);

                // Check if the source balance is sufficient
                double updatedSourceBalance = sourceUser.getWalletBalance();
                if (updatedSourceBalance < amount) {
                    throw new InsufficientBalanceException("Insufficient balance for the transfer");
                }

                userRepository.save(destinationUser);
                
                // Generate a unique transaction reference (e.g., using UUID)
                String transactionReference = UUID.randomUUID().toString();

                // Create transaction for sender (Debit)
                Transaction transactionSender = new Transaction();
                transactionSender.setAmount(amount);
                transactionSender.setType("Debit");
                transactionSender.setLocalDateTime(LocalDateTime.now());
                transactionSender.setUserEmail(destinationEmail);
                transactionSender.setMappedEmail(sourceEmail);
                transactionSender.setTransactionReference(transactionReference);

                // Create transaction for receiver (Credit)
                Transaction transactionReceiver = new Transaction();
                transactionReceiver.setAmount(amount);
                transactionReceiver.setType("Credit");
                transactionReceiver.setLocalDateTime(LocalDateTime.now());
                transactionReceiver.setUserEmail(sourceEmail);
                transactionReceiver.setMappedEmail(destinationEmail);
                transactionReceiver.setTransactionReference(transactionReference);

                // Save the transactions
                transactionRepository.save(transactionSender);
                transactionRepository.save(transactionReceiver);

                return;
            }
        }

        throw new UserNotFoundException("Source or Destination User not Found");
    }

    public File generateAccountStatementCSV(List<TransactionResponse> transactions)
            throws MessagingException, IOException {
        // Create a temporary CSV file
        File tempFile = File.createTempFile("account-statement", ".csv");

        try (CSVWriter csvWriter = new CSVWriter(new FileWriter(tempFile))) {
            // Write the CSV header
            String[] header = { "Transaction Type", "Date", "Amount", "User Email", "Mapped Email" };
            csvWriter.writeNext(header);

            // Write transaction data
            for (TransactionResponse transaction : transactions) {
                String[] rowData = {
                        transaction.getType(),
                        transaction.getLocalDateTime().toString(),
                        String.valueOf(transaction.getAmount()),
                        transaction.getUserEmail(),
                        transaction.getMappedEmail()
                };
                csvWriter.writeNext(rowData);
            }
        }
        return tempFile;
    }

    public void sendAccountStatementAsCsv(String toEmail, List<TransactionResponse> transactions)
            throws MessagingException, IOException {
        // Generate the CSV file
        File csvFile = generateAccountStatementCSV(transactions);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Set the email properties
        helper.setTo(toEmail);
        helper.setSubject("Account Statement");
        helper.setText("Please find your account statement attached.");

        // Attach the CSV file
        FileSystemResource file = new FileSystemResource(csvFile);
        helper.addAttachment("account-statement.csv", file);

        // Send the email
        javaMailSender.send(message);
    }

    public List<TransactionResponse> getAccountStatement(String email) throws MessagingException, IOException {
        List<Transaction> transactions = transactionRepository.findByMappedEmail(email);

        if (transactions != null) {
            List<TransactionResponse> accountStatement = transactions.stream()
                    .map(this::mapTransactionToResponse)
                    .collect(Collectors.toList());

            return accountStatement;
        }

        throw new UserNotFoundException("User Not Found");
    }

    public TransactionResponse mapTransactionToResponse(Transaction transaction) {
        TransactionResponse transactionResponse = new TransactionResponse(null, null, 0, null, null);
        transactionResponse.setType(transaction.getType());
        transactionResponse.setLocalDateTime(transaction.getLocalDateTime());
        transactionResponse.setAmount(transaction.getAmount());
        transactionResponse.setUserEmail(transaction.getUserEmail());
        transactionResponse.setMappedEmail(transaction.getMappedEmail());
        return transactionResponse;
    }

    public User getUserDetails(String id) {
        User user = userRepository.findByEmail(id);
        return user;
    }

    public UserCurrentBalance getWalletBalance(String id) {
        User user = userRepository.findByEmail(id);
        UserCurrentBalance userCurrentBalance = new UserCurrentBalance();
        userCurrentBalance.setAmount(user.getWalletBalance());
        return userCurrentBalance;
    }

    @Transactional
    public void earnCashback(CashbackRequest request) {
        String email = request.getUserId();
        double rechargeAmount = request.getRechargeAmount();
        User user = userRepository.findByEmail(email);

        if (user != null) {
            double cashbackAmount = rechargeAmount * 0.05; // 5% cashback

            user.setWalletBalance(user.getWalletBalance() + cashbackAmount);

            userRepository.save(user);

            Transaction cashback = new Transaction();
            cashback.setAmount(cashbackAmount);
            cashback.setLocalDateTime(LocalDateTime.now());
            cashback.setType("Cashback");
            cashback.setUserEmail(email);
            cashback.setMappedEmail(email);

            transactionRepository.save(cashback);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    public List<Transaction> getCashbackList(String email) {
        List<Transaction> cashbackList = transactionRepository.findByUserEmailAndType(email, "Cashback");

        if (!cashbackList.isEmpty()) {
            return cashbackList;
        }

        throw new UserNotFoundException("User Not Found");
    }

    public void sendAccountStatementOnMail(String userEmail) {
        List<Transaction> transactions = transactionRepository.findByMappedEmail(userEmail);

        if (transactions != null) {
            List<TransactionResponse> accountStatement = transactions.stream()
                    .map(this::mapTransactionToResponse)
                    .collect(Collectors.toList());

            try {
                sendAccountStatementAsCsv(userEmail, accountStatement);
                System.out.println("Account statement sent successfully.");
            } catch (MessagingException | IOException e) {
                System.out.println("Failed to send account statement.");
                e.printStackTrace();
            }

            return;
        }
        throw new UserNotFoundException("User Not Found");
    }

}
