/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import com.pdh.pojo.Category;
import java.util.List;

/**
 *
 * @author duchi
 */
public interface CategoryServices {
    public List<Category> getCates();
    public Category getCateById(int id);
}
