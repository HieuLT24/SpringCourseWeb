package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.pojo.Lecture;
import com.pdh.pojo.Exam;
import com.pdh.pojo.Forum;
import com.pdh.pojo.Post;
import com.pdh.pojo.User;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.LectureServices;
import com.pdh.services.ExamServices;
import com.pdh.services.ForumServices;
import com.pdh.services.PostServices;
import com.pdh.services.UserServices;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/learning")
public class ApiLearningController {
    @Autowired private CourseServices courseService;
    @Autowired private LectureServices lectureService;
    @Autowired private ExamServices examService;
    @Autowired private ForumServices forumService;
    @Autowired private PostServices postService;
    @Autowired private EnrollmentServices enrollmentService;
    @Autowired private UserServices userServices;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> learningDashboard(@PathVariable int courseId, Authentication authentication) {
        Course course = courseService.getCourseById(courseId);
        if (course == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        response.put("course", course);
        response.put("lectures", lectureService.getLecturesByCourseId(courseId));
        response.put("exams", examService.getExamsByCourseId(courseId));
        response.put("forum", forumService.getForumByCourseId(courseId));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/course/{courseId}/lectures")
    public ResponseEntity<?> getLectures(@PathVariable int courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(lectureService.getLecturesByCourseId(courseId));
    }

    @GetMapping("/course/{courseId}/exams")
    public ResponseEntity<?> getExams(@PathVariable int courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(examService.getExamsByCourseId(courseId));
    }

    @GetMapping("/course/{courseId}/lecture/{lectureId}")
    public ResponseEntity<?> viewLecture(@PathVariable int courseId, @PathVariable int lectureId) {
        Course course = courseService.getCourseById(courseId);
        Lecture lecture = lectureService.getLectureById(lectureId);

        if (course == null || lecture == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        response.put("course", course);
        response.put("lecture", lecture);
        response.put("allLectures", lectureService.getLecturesByCourseId(courseId));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/course/{courseId}/exam/{examId}")
    public ResponseEntity<?> takeExam(@PathVariable int courseId, @PathVariable int examId) {
        Course course = courseService.getCourseById(courseId);
        Exam exam = examService.getExamById(examId);

        if (course == null || exam == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        response.put("course", course);
        response.put("exam", exam);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/course/{courseId}/exam/{examId}/submit")
    public ResponseEntity<?> submitExam(@PathVariable int courseId,
                                        @PathVariable int examId,
                                        @RequestBody Map<String, Object> payload) {
        // TODO: implement logic chấm điểm
        // payload có thể chứa { "answers": [...] }

        return ResponseEntity.ok("Exam submitted successfully");
    }

    @GetMapping("/course/{courseId}/forum")
    public ResponseEntity<?> viewForum(@PathVariable int courseId) {
        Course course = courseService.getCourseById(courseId);
        Forum forum = forumService.getForumByCourseId(courseId);

        if (course == null || forum == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        response.put("course", course);
        response.put("forum", forum);
        response.put("posts", postService.getPostsByForumId(forum.getId()));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/course/{courseId}/forum/post")
    public ResponseEntity<?> createPost(@PathVariable int courseId,
                                        @RequestBody Map<String, String> payload,
                                        Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập.");

        User currentUser = userServices.getUserByUsername(authentication.getName());
        if (currentUser == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy user.");

        Course course = courseService.getCourseById(courseId);
        if (course == null)
            return ResponseEntity.notFound().build();

        if (!enrollmentService.isUserEnrolled(currentUser.getId(), courseId))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn chưa đăng ký khóa học.");

        Forum forum = forumService.getForumByCourseId(courseId);
        if (forum == null)
            return ResponseEntity.badRequest().body("Forum không tồn tại.");

        Post newPost = new Post();
        newPost.setTitle(payload.get("title"));
        newPost.setContent(payload.get("content"));
        newPost.setUserId(currentUser);
        newPost.setForumId(forum);
        newPost.setCreatedAt(new Date());

        postService.addOrUpdate(newPost);

        return ResponseEntity.ok(newPost);
    }

    @GetMapping("/course/{courseId}/forum/post/{postId}")
    public ResponseEntity<?> viewPost(@PathVariable int courseId, @PathVariable int postId) {
        Course course = courseService.getCourseById(courseId);
        Post post = postService.getPostById(postId);

        if (course == null || post == null)
            return ResponseEntity.notFound().build();

        if (!post.getForumId().getCourseId().getId().equals(course.getId()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post không thuộc course này.");

        Map<String, Object> response = new HashMap<>();
        response.put("course", course);
        response.put("forum", post.getForumId());
        response.put("post", post);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/course/{courseId}/notifications")
    public ResponseEntity<?> viewNotifications(@PathVariable int courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        response.put("course", course);
        response.put("lectures", lectureService.getLecturesByCourseId(courseId));
        response.put("exams", examService.getExamsByCourseId(courseId));
        response.put("forum", forumService.getForumByCourseId(courseId));

        return ResponseEntity.ok(response);
    }

    

}


