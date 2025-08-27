/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import com.pdh.pojo.User;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

/**
 *
 * @author duchi
 */
public interface UserServices extends UserDetailsService {
    User getUserByUsername(String username);
    User getUserByEmail(String email);
    boolean isUsernameExists(String username);
    boolean isEmailExists(String email);
    void createOrUpdateUser(User user);
    List<User> getUsers();
    User getUserById(int id);
    void deleteUserById(int id);
    // User registerUser(String name, String email, String username, String password);
}
