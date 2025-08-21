/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.repositories;

import java.util.List;

/**
 *
 * @author duchi
 */
public interface StatsRepository {
    List<Object[]> getRevenueByCourse();
    List<Object[]> getRevenueByTime(String time, int year);
}
