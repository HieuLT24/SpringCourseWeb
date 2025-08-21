/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.services.impl;

import com.pdh.pojo.Category;
import com.pdh.repositories.CategoryRepository;
import com.pdh.services.CategoryServices;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author duchi
 */
@Service
public class CategoryServicesImpl implements CategoryServices {

    @Autowired
    public CategoryRepository cateRepo;

    @Override
    public List<Category> getCates() {
        return this.cateRepo.getCates();
    }

    @Override
    public Category getCateById(int id) {
        return this.cateRepo.getCateById(id);
    }

}
