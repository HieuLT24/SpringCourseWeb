/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import java.util.List;

import com.pdh.pojo.User;

/**
 *
 * @author duchi
 */
public interface UserRepository {
    public User getUserByUsername(String username);
    public User getUserByEmail(String email);
    public boolean isUsernameExists(String username);
    public boolean isEmailExists(String email);
    public boolean isUsernameExistsExceptId(String username, int excludeId);
    public boolean isEmailExistsExceptId(String email, int excludeId);
    public void createOrUpdateUser(User user);
    public void updateUser(User user);
    public List<User> getUsers();
    public User getUserById(int id);
    public void deleteUserById(int id);
}
