-- Seed data for Category, Course, Lecture, Forum, Post, Exam, Question, Answer
-- NOTE: Adjust user_id/teacher_id if you have existing users. Currently set to NULL.

-- Categories
INSERT INTO category (name) VALUES
('Lập trình Web'),
('Khoa học dữ liệu'),
('Trí tuệ nhân tạo'),
('Di động'),
('DevOps'),
('UI/UX'),
('Bảo mật'),
('Cơ sở dữ liệu'),
('Kinh doanh CNTT'),
('Hệ thống nhúng');

-- Courses (20 courses)
INSERT INTO course (title, description, price, status, category_id, teacher_id, image) VALUES
('Spring Boot Cơ bản', 'Khóa học nhập môn Spring Boot cho người mới bắt đầu', 499000, 'active', 1, NULL, 'https://picsum.photos/seed/sb1/600/300'),
('Spring Boot Nâng cao', 'Xây dựng API, bảo mật và triển khai với Spring', 799000, 'active', 1, NULL, 'https://picsum.photos/seed/sb2/600/300'),
('React từ A-Z', 'Xây dựng SPA hiện đại với React', 699000, 'active', 1, NULL, 'https://picsum.photos/seed/react1/600/300'),
('Kotlin Android', 'Phát triển ứng dụng Android bằng Kotlin', 599000, 'active', 4, NULL, 'https://picsum.photos/seed/and1/600/300'),
('iOS Swift', 'Lập trình iOS với SwiftUI', 899000, 'active', 4, NULL, 'https://picsum.photos/seed/ios1/600/300'),
('Docker & Kubernetes', 'Container hóa và orkestration trên K8s', 899000, 'active', 5, NULL, 'https://picsum.photos/seed/devops1/600/300'),
('CI/CD với Jenkins', 'Thiết lập pipeline CI/CD chuẩn', 599000, 'active', 5, NULL, 'https://picsum.photos/seed/devops2/600/300'),
('Data Science Python', 'Phân tích dữ liệu với Pandas, NumPy', 799000, 'active', 2, NULL, 'https://picsum.photos/seed/ds1/600/300'),
('Machine Learning', 'Thuật toán học máy phổ biến', 999000, 'active', 3, NULL, 'https://picsum.photos/seed/ml1/600/300'),
('Deep Learning', 'Mạng nơ-ron sâu với TensorFlow/PyTorch', 1299000, 'active', 3, NULL, 'https://picsum.photos/seed/dl1/600/300'),
('SQL Cơ bản', 'Truy vấn cơ sở dữ liệu với SQL', 399000, 'active', 8, NULL, 'https://picsum.photos/seed/sql1/600/300'),
('NoSQL MongoDB', 'Lưu trữ dữ liệu phi quan hệ', 499000, 'active', 8, NULL, 'https://picsum.photos/seed/nosql1/600/300'),
('An toàn ứng dụng Web', 'Các lỗ hổng OWASP Top 10', 899000, 'active', 7, NULL, 'https://picsum.photos/seed/sec1/600/300'),
('UX Design', 'Thiết kế trải nghiệm người dùng', 699000, 'active', 6, NULL, 'https://picsum.photos/seed/ux1/600/300'),
('Kinh doanh CNTT', 'Quản trị dự án và sản phẩm', 799000, 'active', 9, NULL, 'https://picsum.photos/seed/biz1/600/300'),
('Spring Security', 'Xác thực & phân quyền trong Spring', 699000, 'active', 1, NULL, 'https://picsum.photos/seed/sec2/600/300'),
('Testing với JUnit', 'Unit test và tích hợp', 499000, 'active', 1, NULL, 'https://picsum.photos/seed/test1/600/300'),
('Next.js Cơ bản', 'SSR/SSG với Next.js', 799000, 'active', 1, NULL, 'https://picsum.photos/seed/next1/600/300'),
('TypeScript Nâng cao', 'Kiểu tĩnh cho JavaScript', 599000, 'active', 1, NULL, 'https://picsum.photos/seed/ts1/600/300'),
('Golang Web', 'Xây dựng web service với Go', 899000, 'active', 1, NULL, 'https://picsum.photos/seed/go1/600/300');

-- Forums: 1 forum cho mỗi course (20)
INSERT INTO forum (title, course_id) 
SELECT CONCAT('Diễn đàn ', c.title), c.id FROM course c;

-- Lectures: 5 bài/khóa (100 lectures)
-- Giả định id course hiện có là 1..20
INSERT INTO lecture (content, created_at, course_id, video_url, attachment_url) VALUES
('Giới thiệu khóa học', '2025-01-01 00:00:00', 1, 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', NULL),
('Cài đặt môi trường', '2025-01-02 00:00:00', 1, NULL, 'https://example.com/docs/setup.pdf'),
('Cấu trúc dự án', '2025-01-03 00:00:00', 1, NULL, NULL),
('REST Controller', '2025-01-04 00:00:00', 1, 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', NULL),
('Repository & Service', '2025-01-05 00:00:00', 1, NULL, NULL);

-- Lặp thêm cho các course 2..20 (ít hơn để file ngắn; bạn có thể nhân bản thêm)
INSERT INTO lecture (content, created_at, course_id) VALUES
('Bài 1 - Nội dung', '2025-01-01 00:00:00', 2),
('Bài 2 - Nội dung', '2025-01-02 00:00:00', 2),
('Bài 3 - Nội dung', '2025-01-03 00:00:00', 2),
('Bài 4 - Nội dung', '2025-01-04 00:00:00', 2),
('Bài 5 - Nội dung', '2025-01-05 00:00:00', 2),
('Bài 1 - Nội dung', '2025-01-01 00:00:00', 3),
('Bài 2 - Nội dung', '2025-01-02 00:00:00', 3),
('Bài 3 - Nội dung', '2025-01-03 00:00:00', 3),
('Bài 4 - Nội dung', '2025-01-04 00:00:00', 3),
('Bài 5 - Nội dung', '2025-01-05 00:00:00', 3);

-- Exams: 1 bài kiểm tra/khóa cho 10 khóa đầu
INSERT INTO exam (type, course_id) VALUES
('Trắc nghiệm', 1),('Trắc nghiệm', 2),('Trắc nghiệm', 3),('Trắc nghiệm', 4),('Trắc nghiệm', 5),
('Trắc nghiệm', 6),('Trắc nghiệm', 7),('Trắc nghiệm', 8),('Trắc nghiệm', 9),('Trắc nghiệm', 10);

-- Questions: 3 câu mỗi exam (30)
INSERT INTO question (content, exam_id) VALUES
('Câu 1: Khái niệm cơ bản?', 1),
('Câu 2: Thành phần chính?', 1),
('Câu 3: Ứng dụng thực tế?', 1),
('Câu 1: Khái niệm cơ bản?', 2),
('Câu 2: Thành phần chính?', 2),
('Câu 3: Ứng dụng thực tế?', 2),
('Câu 1: Khái niệm cơ bản?', 3),
('Câu 2: Thành phần chính?', 3),
('Câu 3: Ứng dụng thực tế?', 3);

-- Answers: 4 đáp án/câu, 1 đúng (is_true: 1), còn lại 0
-- Cho 9 câu đầu để ngắn gọn; có thể nhân bản thêm tương tự
INSERT INTO answer (content, is_true, question_id) VALUES
('Đáp án A', 1, 1), ('Đáp án B', 0, 1), ('Đáp án C', 0, 1), ('Đáp án D', 0, 1),
('Đáp án A', 0, 2), ('Đáp án B', 1, 2), ('Đáp án C', 0, 2), ('Đáp án D', 0, 2),
('Đáp án A', 0, 3), ('Đáp án B', 0, 3), ('Đáp án C', 1, 3), ('Đáp án D', 0, 3),
('Đáp án A', 1, 4), ('Đáp án B', 0, 4), ('Đáp án C', 0, 4), ('Đáp án D', 0, 4),
('Đáp án A', 0, 5), ('Đáp án B', 1, 5), ('Đáp án C', 0, 5), ('Đáp án D', 0, 5),
('Đáp án A', 0, 6), ('Đáp án B', 0, 6), ('Đáp án C', 1, 6), ('Đáp án D', 0, 6),
('Đáp án A', 1, 7), ('Đáp án B', 0, 7), ('Đáp án C', 0, 7), ('Đáp án D', 0, 7),
('Đáp án A', 0, 8), ('Đáp án B', 1, 8), ('Đáp án C', 0, 8), ('Đáp án D', 0, 8),
('Đáp án A', 0, 9), ('Đáp án B', 0, 9), ('Đáp án C', 1, 9), ('Đáp án D', 0, 9);

-- Posts: mỗi forum thêm 2 bài post mẫu với user NULL (có thể cập nhật sau)
INSERT INTO post (content, created_at, forum_id, user_id) 
SELECT CONCAT('Bài viết #1 của ', f.title), '2025-01-10 00:00:00', f.id, NULL FROM forum f;

INSERT INTO post (content, created_at, forum_id, user_id) 
SELECT CONCAT('Bài viết #2 của ', f.title), '2025-01-11 00:00:00', f.id, NULL FROM forum f;


