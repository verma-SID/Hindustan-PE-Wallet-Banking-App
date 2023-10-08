package backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import backend.entity.Transaction;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    // List<Transaction> findByUserId(String userId);
    List<Transaction> findByUserEmail(String userEmail);
    List<Transaction> findByMappedEmail(String mappedEmail);
    List<Transaction> findByUserEmailAndType(String email,String type);
    void deleteByTransactionReference(String transactionReference);
}
