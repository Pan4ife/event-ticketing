package io.github.pan4ife.eventticketing;

import org.springframework.boot.SpringApplication;

public class TestEventTicketingApplication {

    public static void main(String[] args) {
        SpringApplication.from(EventTicketingApplication::main)
                .with(TestcontainersConfiguration.class)
                .run(args);
    }
}
