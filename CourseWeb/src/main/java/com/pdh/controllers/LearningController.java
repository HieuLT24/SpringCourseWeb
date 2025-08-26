package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.pojo.Lecture;
import com.pdh.pojo.Exam;
import com.pdh.pojo.Forum;
import com.pdh.pojo.Post;
import com.pdh.pojo.User;
import com.pdh.services.CourseServices;
import com.pdh.services.LectureServices;
import com.pdh.services.ExamServices;
import com.pdh.services.ForumServices;
import com.pdh.services.PostServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.Date;

@Controller
@RequestMapping("/learning")
public class LearningController {
    
    @Autowired
    private CourseServices courseService;
    
    @Autowired
    private LectureServices lectureService;
    
    @Autowired
    private ExamServices examService;
    
    @Autowired
    private ForumServices forumService;
    
    @Autowired
    private PostServices postService;
    
    @Autowired
    private EnrollmentServices enrollmentService;
    
    @Autowired
    private UserServices userServices;
    
    // Trang chính để học khóa học
    @GetMapping("/course/{courseId}")
    public String learningDashboard(Model model, @PathVariable("courseId") int courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return "redirect:/";
        }
        
        // Kiểm tra xem user có đăng ký khóa học này không
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            // TODO: Implement proper user authentication check
            // For now, we'll allow access to all enrolled users
        }
        
        List<Lecture> lectures = lectureService.getLecturesByCourseId(courseId);
        List<Exam> exams = examService.getExamsByCourseId(courseId);
        Forum forum = forumService.getForumByCourseId(courseId);
        
        model.addAttribute("course", course);
        model.addAttribute("lectures", lectures);
        model.addAttribute("exams", exams);
        model.addAttribute("forum", forum);
        model.addAttribute("activeSection", "overview");
        
        return "learning/dashboard";
    }

    // Trang danh sách bài giảng (URL riêng)
    @GetMapping("/course/{courseId}/lectures")
    public String learningLectures(Model model, @PathVariable("courseId") int courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return "redirect:/";
        }
        List<Lecture> lectures = lectureService.getLecturesByCourseId(courseId);
        List<Exam> exams = examService.getExamsByCourseId(courseId);
        Forum forum = forumService.getForumByCourseId(courseId);
        model.addAttribute("course", course);
        model.addAttribute("lectures", lectures);
        model.addAttribute("exams", exams);
        model.addAttribute("forum", forum);
        model.addAttribute("activeSection", "lectures");
        return "learning/dashboard";
    }

    // Trang danh sách bài kiểm tra (URL riêng)
    @GetMapping("/course/{courseId}/exams")
    public String learningExams(Model model, @PathVariable("courseId") int courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return "redirect:/";
        }
        List<Lecture> lectures = lectureService.getLecturesByCourseId(courseId);
        List<Exam> exams = examService.getExamsByCourseId(courseId);
        Forum forum = forumService.getForumByCourseId(courseId);
        model.addAttribute("course", course);
        model.addAttribute("lectures", lectures);
        model.addAttribute("exams", exams);
        model.addAttribute("forum", forum);
        model.addAttribute("activeSection", "exams");
        return "learning/dashboard";
    }

    

    // Xem bài giảng cụ thể
    @GetMapping("/course/{courseId}/lecture/{lectureId}")
    public String viewLecture(Model model, 
                            @PathVariable("courseId") int courseId,
                            @PathVariable("lectureId") int lectureId) {
        Course course = courseService.getCourseById(courseId);
        Lecture lecture = lectureService.getLectureById(lectureId);
        
        if (course == null || lecture == null) {
            return "redirect:/learning/course/" + courseId;
        }
        
        List<Lecture> allLectures = lectureService.getLecturesByCourseId(courseId);
        
        model.addAttribute("course", course);
        model.addAttribute("lecture", lecture);
        model.addAttribute("allLectures", allLectures);
        
        return "learning/lecture";
    }
    
    


    // Làm bài kiểm tra
    @GetMapping("/course/{courseId}/exam/{examId}")
    public String takeExam(Model model,
                          @PathVariable("courseId") int courseId,
                          @PathVariable("examId") int examId) {
        Course course = courseService.getCourseById(courseId);
        Exam exam = examService.getExamById(examId);
        
        if (course == null || exam == null) {
            return "redirect:/learning/course/" + courseId;
        }
        
        model.addAttribute("course", course);
        model.addAttribute("exam", exam);
        
        return "learning/exam";
    }
    
    // Nộp bài kiểm tra
    @PostMapping("/course/{courseId}/exam/{examId}/submit")
    public String submitExam(@PathVariable("courseId") int courseId,
                           @PathVariable("examId") int examId,
                           @RequestParam("answers") String[] answers) {
        // Xử lý nộp bài kiểm tra
        // TODO: Implement exam submission logic
        
        return "redirect:/learning/course/" + courseId + "?success=exam_submitted";
    }
    
    // Xem diễn đàn
    @GetMapping("/course/{courseId}/forum")
    public String viewForum(Model model, @PathVariable("courseId") int courseId) {
        Course course = courseService.getCourseById(courseId);
        Forum forum = forumService.getForumByCourseId(courseId);
        List<Post> posts = postService.getPostsByForumId(forum.getId());
        
        if (course == null || forum == null) {
            return "redirect:/learning/course/" + courseId;
        }
        
        model.addAttribute("course", course);
        model.addAttribute("forum", forum);
        model.addAttribute("posts", posts);
        
        return "learning/forum";
    }
    
    // Tạo bài viết mới trong diễn đàn
    @PostMapping("/course/{courseId}/forum/post")
    public String createPost(@PathVariable("courseId") int courseId,
                           @RequestParam("title") String title,
                           @RequestParam("content") String content,
                           Authentication authentication) {
        // Kiểm tra xác thực
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }
        
        // Lấy thông tin user hiện tại
        User currentUser = this.userServices.getUserByUsername(authentication.getName());
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        // Kiểm tra course tồn tại
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return "redirect:/";
        }
        
        // Kiểm tra user đã đăng ký khóa học chưa
        boolean isEnrolled = enrollmentService.isUserEnrolled(currentUser.getId(), courseId);
        if (!isEnrolled) {
            return "redirect:/learning/course/" + courseId + "/forum?error=not_enrolled";
        }
        
        // Lấy forum của khóa học
        Forum forum = forumService.getForumByCourseId(courseId);
        if (forum == null) {
            return "redirect:/learning/course/" + courseId + "/forum?error=forum_not_found";
        }
        
        // Tạo bài viết mới
        Post newPost = new Post();
        newPost.setTitle(title);
        newPost.setContent(content);
        newPost.setUserId(currentUser);
        newPost.setForumId(forum);
        newPost.setCreatedAt(new Date());
        
        // Lưu bài viết
        postService.addOrUpdate(newPost);
        
        return "redirect:/learning/course/" + courseId + "/forum?success=post_created";
    }
    
    // Xem chi tiết bài viết trong diễn đàn
    @GetMapping("/course/{courseId}/forum/post/{postId}")
    public String viewPost(Model model,
                           @PathVariable("courseId") int courseId,
                           @PathVariable("postId") int postId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return "redirect:/";
        }
        Post post = postService.getPostById(postId);
        if (post == null || post.getForumId() == null || post.getForumId().getCourseId() == null 
                || !post.getForumId().getCourseId().getId().equals(course.getId())) {
            return "redirect:/learning/course/" + courseId + "/forum";
        }
        Forum forum = post.getForumId();
        model.addAttribute("course", course);
        model.addAttribute("forum", forum);
        model.addAttribute("post", post);
        return "learning/post-detail";
    }
    
    // Xem thông báo
    @GetMapping("/course/{courseId}/notifications")
    public String viewNotifications(Model model, @PathVariable("courseId") int courseId) {
        Course course = courseService.getCourseById(courseId);
        
        if (course == null) {
            return "redirect:/";
        }
        // Reuse forum as notifications source placeholder
        List<Lecture> lectures = lectureService.getLecturesByCourseId(courseId);
        List<Exam> exams = examService.getExamsByCourseId(courseId);
        Forum forum = forumService.getForumByCourseId(courseId);
        model.addAttribute("course", course);
        model.addAttribute("lectures", lectures);
        model.addAttribute("exams", exams);
        model.addAttribute("forum", forum);
        return "learning/notifications";
    }
}
