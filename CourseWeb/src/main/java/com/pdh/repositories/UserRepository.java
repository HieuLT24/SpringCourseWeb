/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.User;

/**
 *
 * @author duchi
 */
public interface UserRepository {
    public User getUserByUsername(String username);
    public void createOrUpdateUser(User user);
}
