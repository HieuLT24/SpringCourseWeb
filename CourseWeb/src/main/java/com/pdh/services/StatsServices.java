/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.pdh.services;

import java.util.List;

/**
 *
 * @author duchi
 */
public interface StatsServices {
    List<Object[]> getRevenueByCourse();
    List<Object[]> getRevenueByTime(String time, int year);
    List<Object[]> getRevenueByTimeAndCourse(String time, int year, Integer courseId);
}
