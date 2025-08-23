
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
    "com.pdh.configs"
})
public class SpringSecurityConfigs {

    @Autowired
    private UserDetailsService userDetailsService;

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
            .authorizeHttpRequests(requests -> requests
                .requestMatchers("/", "/home", "/login", "/register", "/forgot-password", "/reset-password", "/courses/**", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/courses/**").hasRole("ADMIN")
                .requestMatchers("/api/enroll/**").authenticated() // API đăng ký khóa học
                .requestMatchers("/stats").hasRole("ADMIN") // Backward compatibility
                .anyRequest().authenticated())
            .formLogin(form -> form.loginPage("/login")
                .loginProcessingUrl("/login")
                .successHandler((request, response, authentication) -> {
                    try {
                        String contextPath = request.getContextPath();
                        if (authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
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
}