package backend.service;

import backend.entity.User;
import backend.model.TransferRequest;
import backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class ConcurrentTransferTest {

    @Autowired
    private UserService transferService; // Replace with the actual name of your service

    // ... (other setup code)

    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional
    public void testConcurrentTransfers() throws InterruptedException {
        int numThreads = 5; // Number of concurrent transfer threads
        double initialBalance = 1000.0; // Initial balance for test users

        // Create test users with initial balances
        User user1 = createUser("user1@example.com", initialBalance);
        User user2 = createUser("user2@example.com", initialBalance);

        // Save test users to the database
        userRepository.save(user1);
        userRepository.save(user2);

        // Create an executor service for concurrent transfers
        ExecutorService executorService = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);

        for (int i = 0; i < numThreads; i++) {
            executorService.submit(() -> {
                try {
                    // Perform a concurrent transfer
                    TransferRequest request = new TransferRequest();
                    request.setSourceEmail("user1@example.com");
                    request.setDestinationEmail("user2@example.com");
                    request.setAmount(100.0); // Adjust the transfer amount as needed
                    transferService.transferAmount(request);

                    latch.countDown();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }

        // Wait for all threads to complete
        latch.await(5, TimeUnit.SECONDS); // Adjust the timeout as needed

        // Fetch the updated user balances after transfers
        User updatedUser1 = userRepository.findByEmail("user1@example.com");
        User updatedUser2 = userRepository.findByEmail("user2@example.com");

        // Validate final user balances
        assertEquals(initialBalance - (numThreads * 100.0), updatedUser1.getWalletBalance(), 0.001);
        assertEquals(initialBalance + (numThreads * 100.0), updatedUser2.getWalletBalance(), 0.001);
    }

    // Helper method to create a user with a given email and initial balance
    private User createUser(String email, double balance) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("password"); // Set a default password
        user.setWalletBalance(balance);
        return user;
    }
}
