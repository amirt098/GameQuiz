package com.gamequiz.security;

import com.gamequiz.model.User;
import com.gamequiz.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public JwtAuthenticationFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7); // Remove "Bearer "
                // For now, we're using a simple mock token format: "mock-jwt-token-{userId}"
                if (token.startsWith("mock-jwt-token-")) {
                    String userId = token.substring("mock-jwt-token-".length());
                    Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));

                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()))
                        );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication", e);
        }

        filterChain.doFilter(request, response);
    }
}


//
//@Component
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final UserRepository userRepository;
//    private final JwtUtils jwtUtils;
//
//    public JwtAuthenticationFilter(UserRepository userRepository, JwtUtils jwtUtils) {
//        this.userRepository = userRepository;
//        this.jwtUtils = jwtUtils;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//        try {
//            String authHeader = request.getHeader("Authorization");
//            if (authHeader != null && authHeader.startsWith("Bearer ")) {
//                String token = authHeader.substring(7);
//
//                if (jwtUtils.validateToken(token)) {
//                    Claims claims = jwtUtils.parseToken(token);
//                    String username = claims.getSubject();
//
//                    Optional<User> userOpt = userRepository.findByUsername(username);
//
//                    if (userOpt.isPresent()) {
//                        User user = userOpt.get();
//                        UsernamePasswordAuthenticationToken authentication =
//                                new UsernamePasswordAuthenticationToken(
//                                        user,
//                                        null,
//                                        Collections.singletonList(
//                                                new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase())
//                                        )
//                                );
//                        authentication.setDetails(
//                                new WebAuthenticationDetailsSource().buildDetails(request)
//                        );
//                        SecurityContextHolder.getContext().setAuthentication(authentication);
//                    }
//                }
//            }
//        } catch (Exception e) {
//            logger.error("Cannot set user authentication", e);
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}