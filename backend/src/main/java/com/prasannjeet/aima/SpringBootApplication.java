package com.prasannjeet.aima;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;

@org.springframework.boot.autoconfigure.SpringBootApplication
public class SpringBootApplication {
	
	public static final Logger LOG = LoggerFactory.getLogger(SpringBootApplication.class);

	public static void main(String[] args) {
		int maxRetries = 5;
		int retryCount = 0;
		boolean started = false;

		while (!started && retryCount < maxRetries) {
			try {
				SpringApplication.run(SpringBootApplication.class, args);
				started = true;
			} catch (Exception e) {
				retryCount++;
				LOG.error("Error starting the application. Retrying in 10 seconds... ({}/{})", retryCount, maxRetries);
				try {
					Thread.sleep(10000);
				} catch (InterruptedException interruptedException) {
					Thread.currentThread().interrupt();
					LOG.error("Error while waiting for retry", interruptedException);
				}
			}
		}

		if (!started) {
			LOG.error("Failed to start the application after {} retries. Exiting.", maxRetries);
			System.exit(1);
		}
	}

}
