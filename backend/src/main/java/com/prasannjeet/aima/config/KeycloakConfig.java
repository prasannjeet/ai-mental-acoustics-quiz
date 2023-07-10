package com.prasannjeet.aima.config;

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

    public String keycloakIssuerUri() {
        if ("https".equals(keycloakScheme) && "443".equals(keycloakAuthPort)) {
            return keycloakScheme + "://" + keycloakAuthServer + "/realms/" + keycloakRealmName;
        } else {
            return keycloakScheme + "://" + keycloakAuthServer + ":" + keycloakAuthPort + "/realms/" + keycloakRealmName;
        }
    }

    public String keycloakJwkSetUri() {
        return keycloakIssuerUri() + "/protocol/openid-connect/certs";
    }

}
