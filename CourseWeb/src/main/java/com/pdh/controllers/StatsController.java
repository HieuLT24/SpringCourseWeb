/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.pdh.controllers;

import com.pdh.services.StatsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 *
 * @author duchi
 */
@Controller
public class StatsController {
    @Autowired
    private StatsServices statsService;
    
    @GetMapping("/stats") 
    public String stats(Model model) {
        model.addAttribute("revenues", this.statsService.getRevenueByProduct());
        return "stats";
    }
}
