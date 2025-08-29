/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import com.pdh.pojo.Category;
import java.util.List;
import java.util.Map;

/**
 *
 * @author duchi
 */
public interface CategoryRepository {
    public List<Category> getCates(Map<String, String> params);
    public Category getCateById(int id);

}
