package com.prasannjeet.notenirvana.config.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.BearerTokenError;
import org.springframework.security.oauth2.server.resource.BearerTokenErrorCodes;

@Slf4j
public class JwtAudienceValidator implements OAuth2TokenValidator<Jwt> {
    private final String audience;

    public JwtAudienceValidator(String audience) {
        this.audience = audience;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        String errorMessage = "The required audience is missing";
        OAuth2Error err = new BearerTokenError(
            BearerTokenErrorCodes.INVALID_TOKEN,
            HttpStatus.UNAUTHORIZED,
            errorMessage,
            "https://tools.ietf.org/html/rfc6750#section-3.1");
        try {
            if (jwt.getAudience().contains(audience)) {
                return OAuth2TokenValidatorResult.success();
            } else {
                log.error("Expected audience {} but found {}", audience, jwt.getAudience());
                return OAuth2TokenValidatorResult.failure(err);
            }
        } catch (Exception e) {
            log.error("Error validating audience", e);
            return OAuth2TokenValidatorResult.failure(err);
        }
    }
}

