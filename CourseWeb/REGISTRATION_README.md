# Chức năng Đăng ký - CourseWeb Backend

## Tổng quan
Chức năng đăng ký đã được triển khai hoàn chỉnh trong backend Spring Boot với các tính năng sau:

## Các thành phần đã tạo

### 1. DTO (Data Transfer Object)
- **File**: `src/main/java/com/pdh/pojo/dto/UserRegistrationDTO.java`
- **Chức năng**: Chứa dữ liệu đăng ký với validation
- **Các trường**:
  - `name`: Họ và tên (2-45 ký tự)
  - `email`: Email (định dạng hợp lệ, tối đa 45 ký tự)
  - `username`: Tên đăng nhập (3-45 ký tự)
  - `password`: Mật khẩu (6-45 ký tự)
  - `confirmPassword`: Xác nhận mật khẩu

### 2. Repository Layer
- **File**: `src/main/java/com/pdh/repositories/UserRepository.java`
- **File**: `src/main/java/com/pdh/repositories/impl/UserRepositoryImpl.java`
- **Chức năng mới**:
  - `getUserByEmail(String email)`: Lấy user theo email
  - `isUsernameExists(String username)`: Kiểm tra username đã tồn tại
  - `isEmailExists(String email)`: Kiểm tra email đã tồn tại

### 3. Service Layer
- **File**: `src/main/java/com/pdh/services/UserServices.java`
- **File**: `src/main/java/com/pdh/services/impl/UserServicesImpl.java`
- **Chức năng mới**:
  - `registerUser(UserRegistrationDTO)`: Đăng ký user mới
  - Validation username và email trùng lặp
  - Mã hóa mật khẩu với BCrypt
  - Gán role mặc định "USER"

### 4. Controller Layer
- **File**: `src/main/java/com/pdh/controllers/AuthController.java`
- **Chức năng**:
  - `GET /register`: Hiển thị form đăng ký
  - `POST /register`: Xử lý đăng ký
  - `GET /login`: Hiển thị form đăng nhập

### 5. REST API Controller
- **File**: `src/main/java/com/pdh/controllers/ApiAuthController.java`
- **Endpoints**:
  - `POST /api/auth/register`: API đăng ký
  - `GET /api/auth/check-username`: Kiểm tra username
  - `GET /api/auth/check-email`: Kiểm tra email

### 6. Template HTML
- **File**: `src/main/resources/templates/register.html`
- **Tính năng**:
  - Form đăng ký đẹp mắt
  - Validation client-side
  - Responsive design
  - Thông báo lỗi và thành công

### 7. Security Configuration
- **File**: `src/main/java/com/pdh/configs/SpringSecurityConfigs.java`
- **Cập nhật**: Cho phép truy cập `/register` và `/api/auth/**` mà không cần xác thực

## Cách sử dụng

### 1. Đăng ký qua Web Form
```
GET /register
POST /register
```

### 2. Đăng ký qua REST API
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "username": "nguyenvana",
  "password": "123456",
  "confirmPassword": "123456"
}
```

### 3. Kiểm tra username/email
```bash
GET /api/auth/check-username?username=nguyenvana
GET /api/auth/check-email?email=nguyenvana@example.com
```

## Validation Rules

### Backend Validation (Jakarta Validation)
- **name**: @NotBlank, @Size(2-45)
- **email**: @NotBlank, @Email, @Size(max=45)
- **username**: @NotBlank, @Size(3-45)
- **password**: @NotBlank, @Size(6-45)

### Business Logic Validation
- Username không được trùng lặp
- Email không được trùng lặp
- Mật khẩu xác nhận phải khớp
- Role mặc định: "USER"

## Bảo mật
- Mật khẩu được mã hóa với BCrypt
- CSRF protection được disable cho API
- Validation cả client-side và server-side
- Thông báo lỗi an toàn (không tiết lộ thông tin nhạy cảm)

## Database
- Sử dụng Hibernate với MySQL
- Entity: `User` với các trường cơ bản
- Named queries đã được định nghĩa trong User entity

## Testing
Để test chức năng đăng ký:

1. Khởi động ứng dụng Spring Boot
2. Truy cập: `http://localhost:8080/register`
3. Điền form đăng ký
4. Kiểm tra database để xác nhận user được tạo
5. Thử đăng nhập với tài khoản vừa tạo

## Lưu ý
- Đảm bảo database đã được cấu hình đúng
- Kiểm tra các dependency trong pom.xml
- Có thể cần restart ứng dụng sau khi thêm các file mới
