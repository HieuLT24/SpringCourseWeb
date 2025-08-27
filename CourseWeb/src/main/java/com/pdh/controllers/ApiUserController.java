package com.pdh.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pdh.dto.user.ChangePasswordRequest;
import com.pdh.dto.user.RegisterRequest;
import com.pdh.pojo.User;
import com.pdh.services.UserServices;

@RestController
@RequestMapping("/api/users")
public class ApiUserController {
    @Autowired
    private UserServices userServices;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu xác nhận không khớp!");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(request.getPassword());
        newUser.setEmail(request.getEmail());
        newUser.setRole("USER");

        userServices.createOrUpdateUser(newUser);

        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userServices.getUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        User u = userServices.getUserById(id);
        if (u == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(u);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        User u = userServices.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(u);
    }
    
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser,
                                           Authentication authentication) {
        User u = userServices.getUserByUsername(authentication.getName());
        if (u == null)
            return ResponseEntity.status(401).body("Không tìm thấy user");

        u.setEmail(updatedUser.getEmail());
        u.setName(updatedUser.getName());
        userServices.createOrUpdateUser(u);

        return ResponseEntity.ok("Cập nhật thành công!");
    }

    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request,
                                            Authentication authentication) {
        User u = userServices.getUserByUsername(authentication.getName());
        if (u == null)
            return ResponseEntity.status(401).body("Không tìm thấy user");

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu xác nhận không khớp!");
        }

        if (!u.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu cũ không đúng!");
        }

        u.setPassword(request.getNewPassword());
        userServices.createOrUpdateUser(u);

        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        userServices.deleteUserById(id);
        return ResponseEntity.ok("Xóa thành công!");
    }
}
