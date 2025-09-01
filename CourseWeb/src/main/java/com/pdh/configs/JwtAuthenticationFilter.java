package com.pdh.configs;

import com.pdh.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                // Validate JWT token
                String username = jwtUtil.validateToken(token);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    try {
                        // Load user details
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        
                        if (userDetails != null) {
                            // Create authentication token
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            
                            // Set authentication in security context
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    } catch (UsernameNotFoundException e) {
                        // User not found in database
                        System.err.println("User not found in database: " + username);
                        // Continue with filter chain - authentication will fail naturally
                    } catch (Exception e) {
                        // Other errors loading user details
                        System.err.println("Error loading user details for username: " + username + ", Error: " + e.getMessage());
                        // Continue with filter chain - authentication will fail naturally
                    }
                } else if (username == null) {
                    // Invalid or expired token
                    System.err.println("Invalid or expired JWT token");
                    // Continue with filter chain - authentication will fail naturally
                }
            }
            
            // Continue with filter chain
            filterChain.doFilter(request, response);
            
        } catch (Exception e) {
            System.err.println("Error in JWT filter: " + e.getMessage());
            e.printStackTrace();
            // Continue with filter chain even if there's an error in the filter
            filterChain.doFilter(request, response);
        }
    }
}


