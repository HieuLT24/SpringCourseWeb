/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.pdh.pojo.User;
import com.pdh.repositories.UserRepository;
import com.pdh.services.UserServices;
import java.util.HashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author duchi
 */
@Service
public class UserServicesImpl implements UserServices {

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User getUserByUsername(String username) {
        return this.userRepo.getUserByUsername(username);
    }
    
    @Override
    public User getUserByEmail(String email) {
        return this.userRepo.getUserByEmail(email);
    }
    
    @Override
    public boolean isUsernameExists(String username) {
        return this.userRepo.isUsernameExists(username);
    }
    
    @Override
    public boolean isEmailExists(String email) {
        return this.userRepo.isEmailExists(email);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = this.getUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid username");
        }
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(u.getRole()));

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(), u.getPassword(), authorities);
    }
    
    @Override
    public void createOrUpdateUser(User user) {
        if (user.getId() != null) {
            if (isUsernameExists(user.getUsername())) {
                throw new RuntimeException("Tên đăng nhập đã tồn tại");
            }
            
            if (isEmailExists(user.getEmail())){
                throw new RuntimeException("Email đã tồn tại");
            }
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        this.userRepo.createOrUpdateUser(user);
    }
    
    // @Override
    // public User createUser(String name, String email, String username, String password) {
    //     // Kiểm tra username và email đã tồn tại chưa
    //     if (isUsernameExists(username)) {
    //         throw new RuntimeException("Tên đăng nhập đã tồn tại");
    //     }
        
    //     if (isEmailExists(email)) {
    //         throw new RuntimeException("Email đã tồn tại");
    //     }
        
    //     // Tạo user mới
    //     User newUser = new User();
    //     newUser.setName(name);
    //     newUser.setEmail(email);
    //     newUser.setUsername(username);
    //     newUser.setPassword(password);
    //     newUser.setRole("USER"); // Role mặc định
        
    //     // Lưu user mới
    //     createOrUpdateUser(newUser);
        
    //     return newUser;
    // }
}
