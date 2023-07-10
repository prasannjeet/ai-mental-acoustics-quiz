package com.prasannjeet.aima.config;

import static java.util.Arrays.stream;
import static java.util.List.of;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static org.springframework.security.oauth2.jwt.JwtDecoders.fromIssuerLocation;
import static org.springframework.security.oauth2.jwt.JwtValidators.createDefaultWithIssuer;

import com.prasannjeet.aima.config.util.JwtAudienceValidator;
import com.prasannjeet.aima.config.util.JwtAuthConverter;
import com.prasannjeet.aima.config.util.RolesLoggingFilter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
  private static final String DEFAULT_AUDIENCE = "account";
  private final JwtAuthConverter jwtAuthConverter;
  private final KeycloakConfig keycloakConfig;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    CorsFilter corsFilter = new CorsFilter(corsConfigurationSource());
    http.authorizeHttpRequests()
        .requestMatchers(
            GET,
            "/swagger-ui.html/**",
            "/swagger-ui/**",
            "/swagger-resources/**",
            "/v3/api-docs/**",
            "/v2/api-docs",
            "/webjars/**",
            "/csrf")
        .permitAll()
        .anyRequest()
        .authenticated();
    http.oauth2ResourceServer().jwt().jwtAuthenticationConverter(jwtAuthConverter);
    http.sessionManagement().sessionCreationPolicy(STATELESS);

    // Add a custom filter to log the user roles
    http.addFilterBefore(new RolesLoggingFilter(), UsernamePasswordAuthenticationFilter.class);

    // Add the CORS filter directly to the security filter chain
    http.addFilterBefore(corsFilter, ChannelProcessingFilter.class);

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    List<String> allowedOriginsList = stream(keycloakConfig.getAllowedOrigins().split(",")).toList();
    configuration.setAllowedOrigins(allowedOriginsList);
    configuration.setAllowedMethods(of("*")); // Allow all methods (GET, POST, etc.)
    configuration.setAllowedHeaders(of("*")); // Allow all headers
    configuration.setAllowCredentials(true); // Allow credentials

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public JwtDecoder jwtDecoder() {
    NimbusJwtDecoder jwtDecoder =
        (NimbusJwtDecoder) fromIssuerLocation(keycloakConfig.keycloakIssuerUri());
    OAuth2TokenValidator<Jwt> withAudience = new JwtAudienceValidator(DEFAULT_AUDIENCE);
    OAuth2TokenValidator<Jwt> withIssuer =
        createDefaultWithIssuer(keycloakConfig.keycloakIssuerUri());
    OAuth2TokenValidator<Jwt> validator =
        new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience);
    jwtDecoder.setJwtValidator(validator);
    return jwtDecoder;
  }
}

// hasAnyRole(ADMIN, USER)
