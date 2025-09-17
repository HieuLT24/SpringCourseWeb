
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.configs;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import java.io.IOException;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

/**
 *
 * @author admin
 */
@Configuration
@EnableTransactionManagement
@EnableWebSecurity
@ComponentScan(basePackages = {
    "com.pdh.controllers",
    "com.pdh.repositories",
    "com.pdh.services",
    "com.pdh.configs",
    "com.pdh.utils",
})
public class SpringSecurityConfigs {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
        return new HandlerMappingIntrospector();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
            Exception {
        http.csrf(c -> c.disable())
            .cors(c -> {})
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(requests -> requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/", "/home", "/login", "/register", "/forgot-password", "/reset-password", "/courses/**", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses").permitAll()
                .requestMatchers("/api/courses/*/enrollments").authenticated()
                .requestMatchers("/api/payment/process").authenticated()
                .requestMatchers("/api/payment/callback/**").permitAll()
                .requestMatchers("/api/users/me/**").authenticated()
                
                .requestMatchers(HttpMethod.POST, "/api/courses/create").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.POST, "/api/learning/course/*/lectures").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.PUT, "/api/learning/course/*/lecture/*").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.DELETE, "/api/learning/course/*/lecture/*").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.POST, "/api/learning/course/*/exams").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.PUT, "/api/learning/course/*/exam/*").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.DELETE, "/api/learning/course/*/exam/*").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.POST, "/api/learning/course/*/exam/*/questions").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.PUT, "/api/learning/course/*/exam/*/question/*").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.DELETE, "/api/learning/course/*/exam/*/question/*").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.POST, "/api/learning/course/*/exam/*/question/*/answers").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.PUT, "/api/learning/course/*/exam/*/question/*/answer/*").hasAuthority("TEACHER")
                .requestMatchers(HttpMethod.DELETE, "/api/learning/course/*/exam/*/question/*/answer/*").hasAuthority("TEACHER")
                
                .requestMatchers("/api/learning/**").authenticated()
                .requestMatchers("/admin/**").hasAuthority("ADMIN")
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
                .anyRequest().permitAll())
            .formLogin(form -> form.loginPage("/login")
                .loginProcessingUrl("/login")
                .successHandler((request, response, authentication) -> {
                    try {
                        String contextPath = request.getContextPath();
                        boolean isAdmin = authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ADMIN"));
                        
                        if (isAdmin) {
                            response.sendRedirect(contextPath + "/admin");
                        } else {
                            response.sendRedirect(contextPath + "/");
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .failureUrl("/login?error=true").permitAll())
            .logout(logout
                -> logout.logoutSuccessUrl("/login").permitAll());
        http.exceptionHandling(ex -> ex
            .defaultAuthenticationEntryPointFor(
                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                new AntPathRequestMatcher("/api/**")
            )
        );
        return http.build();
    }
    
    @Bean
    public Cloudinary cloudinary() {
        Cloudinary cloudinary
                = new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", "dsfghzlat",
                        "api_key", "784677976657694",
                        "api_secret", "Y573YM27ykBpFzzWs7AIq2RWOtY",
                        "secure", true));
        return cloudinary;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}