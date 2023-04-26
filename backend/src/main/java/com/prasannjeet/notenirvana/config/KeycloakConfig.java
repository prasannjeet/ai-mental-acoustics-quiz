package com.prasannjeet.notenirvana.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Data
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("keycloak-config")
public class KeycloakConfig {

    private String keycloakPublicKey;
    private String keycloakClientId;
    private String keycloakClientSecret;
    private String keycloakScheme;
    private String keycloakAuthServer;
    private String keycloakAuthPort;
    private String keycloakRealmName;
    private String allowedOrigins;
}
