/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import com.pdh.pojo.User;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 *
 * @author duchi
 */
public interface UserServices extends UserDetailsService {
    User getUserByUsername(String username);
    void createOrUpdateUser(User user);
}
