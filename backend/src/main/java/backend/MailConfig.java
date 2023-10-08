package backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {
    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        // Configure mailSender with your SMTP settings
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587); // Set your SMTP port
        mailSender.setUsername("siddhanthverma1412cloud@gmail.com");
        mailSender.setPassword("iflsdevqiigmreqn");
        // Enable STARTTLS for secure communication
        mailSender.getJavaMailProperties().setProperty("mail.smtp.starttls.enable", "true");
        mailSender.getJavaMailProperties().setProperty("mail.smtp.auth", "true");

        return mailSender;
    }
}
