/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.repositories.impl;

import com.pdh.pojo.User;
import com.pdh.repositories.UserRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author duchi
 */
@Repository
@Transactional
public class UserRepositoryImpl implements UserRepository{
    
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public User getUserByUsername(String username) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findByUsername", User.class);
        q.setParameter("username", username);
        
        try {
            return (User) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
    
    @Override
    public User getUserByEmail(String email) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findByEmail", User.class);
        q.setParameter("email", email);
        
        try {
            return (User) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
    
    @Override
    public boolean isUsernameExists(String username) {
        return this.getUserByUsername(username) != null;
    }
    
    @Override
    public boolean isEmailExists(String email) {
        return getUserByEmail(email) != null;   
    }
    
    @Override
    public void createOrUpdateUser(User user) {
        Session s = this.factory.getObject().getCurrentSession();
        if (user.getId() != null) {
            s.merge(user);
        } else {
            s.persist(user);
        }
    }
    
}
