package com.pdh.controllers;

import com.pdh.services.StatsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin
public class ApiStatsController {
    @Autowired
    private StatsServices statsService;

    @GetMapping("/revenues")
    public ResponseEntity<?> getRevenues() {
        try {
            return ResponseEntity.ok(statsService.getRevenueByProduct());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error while fetching revenues");
        }
    }
}


