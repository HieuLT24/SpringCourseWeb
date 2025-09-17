package com.pdh.controllers;

import com.pdh.pojo.Course;
import com.pdh.pojo.Lecture;
import com.pdh.pojo.Exam;
import com.pdh.pojo.Forum;
import com.pdh.pojo.Post;
import com.pdh.pojo.Question;
import com.pdh.pojo.Answer;
import com.pdh.dto.forum.CommentDto;
import com.pdh.dto.forum.PostDto;
import com.pdh.dto.exam.ExamDto;
import com.pdh.dto.exam.QuestionDto;
import com.pdh.dto.exam.AnswerDto;
import com.pdh.pojo.Comment;

import java.util.List;
import com.pdh.pojo.User;
import com.pdh.services.CourseServices;
import com.pdh.services.EnrollmentServices;
import com.pdh.services.LectureServices;
import com.pdh.services.ExamServices;
import com.pdh.services.ForumServices;
import com.pdh.services.PostServices;
import com.pdh.services.CommentServices;
import com.pdh.services.QuestionServices;
import com.pdh.services.AnswerServices;
import com.pdh.services.UserServices;
import com.pdh.services.UserExamServices;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import com.pdh.dto.lecture.LectureRequest;

@RestController
@RequestMapping("/api/learning")
@CrossOrigin
public class ApiLearningController {
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
    private CommentServices commentService;
    @Autowired
    private EnrollmentServices enrollmentService;
    @Autowired
    private UserServices userServices;
    @Autowired
    private QuestionServices questionServices;
    @Autowired
    private AnswerServices answerServices;
    @Autowired
    private UserExamServices userExamServices;

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

    @PostMapping("/course/{courseId}/lectures")
    public ResponseEntity<?> createLecture(@PathVariable int courseId,
            @RequestParam("content") String content,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) {
        try {
            LectureRequest request = new LectureRequest();
            request.setContent(content);
            request.setVideo(video);
            request.setAttachment(attachment);
            request.setCourseId(courseId);

            Lecture newLecture = lectureService.createLecture(request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo bài giảng thành công!");
            response.put("lecture", newLecture);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo bài giảng: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/course/{courseId}/lecture/{lectureId}")
    public ResponseEntity<?> updateLecture(@PathVariable int courseId,
            @PathVariable int lectureId,
            @RequestParam("content") String content,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) {
        try {
            LectureRequest request = new LectureRequest();
            request.setContent(content);
            request.setVideo(video);
            request.setAttachment(attachment);
            request.setCourseId(courseId);

            Lecture updatedLecture = lectureService.updateLecture(lectureId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật bài giảng thành công!");
            response.put("lecture", updatedLecture);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật bài giảng: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/course/{courseId}/lecture/{lectureId}")
    public ResponseEntity<?> deleteLecture(@PathVariable int courseId, @PathVariable int lectureId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = auth.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền xóa bài giảng này");
            }

            lectureService.deleteLecture(lectureId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa bài giảng thành công!");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa bài giảng: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    

    @GetMapping("/course/{courseId}/exams")
    public ResponseEntity<?> getExams(@PathVariable int courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(examService.getExamsByCourseId(courseId));
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
        try {
            java.math.BigDecimal best = null;
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                User u = userServices.getUserByUsername(auth.getName());
                if (u != null) {
                    best = userExamServices.findBestScore(u.getId(), examId);
                }
            }
            if (best != null)
                response.put("bestScore", best);
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/course/{courseId}/exam/{examId}/questions")
    public ResponseEntity<?> getExamQuestions(@PathVariable int courseId, @PathVariable int examId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit) {
        Course course = courseService.getCourseById(courseId);
        Exam exam = examService.getExamById(examId);
        if (course == null || exam == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> examInfo = new HashMap<>();
        examInfo.put("id", exam.getId());
        examInfo.put("type", exam.getType());
        examInfo.put("durationMinutes", exam.getDurationMinutes());
        result.put("exam", examInfo);
        
        Map<String, Object> questionsData = questionServices.getQuestionsByExamIdWithPagination(examId, page, limit);
        result.put("questions", questionsData.get("questions"));
        result.put("total", questionsData.get("total"));
        result.put("totalPages", questionsData.get("totalPages"));
        result.put("currentPage", page);
        result.put("limit", limit);
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/course/{courseId}/exam/{examId}/submit")
    public ResponseEntity<?> submitExam(@PathVariable int courseId,
            @PathVariable int examId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        Exam exam = examService.getExamById(examId);
        Course course = courseService.getCourseById(courseId);
        if (course == null || exam == null)
            return ResponseEntity.notFound().build();

        Object ansObj = payload.get("answers");
        if (!(ansObj instanceof Map))
            return ResponseEntity.badRequest().body("Invalid answers payload");

        @SuppressWarnings("unchecked")
        Map<String, Object> ansMap = (Map<String, Object>) ansObj;

        int totalQuestions = 0;
        int totalCorrect = 0;
        for (var q : questionServices.getQuestionsByExamId(examId)) {
            totalQuestions++;
            Object aIdObj = ansMap.get(String.valueOf(q.getId()));
            if (aIdObj == null)
                continue;
            try {
                int aId = Integer.parseInt(aIdObj.toString());
                boolean isTrue = q.getAnswerSet().stream()
                        .anyMatch(a -> a.getId() == aId && a.getIsTrue() != null && a.getIsTrue() == 1);
                if (isTrue)
                    totalCorrect++;
            } catch (NumberFormatException ignored) {
            }
        }

        double score = totalQuestions > 0 ? (totalCorrect * 10.0 / totalQuestions) : 0.0;
        try {
            if (authentication != null && authentication.isAuthenticated()) {
                com.pdh.pojo.User user = userServices.getUserByUsername(authentication.getName());
                if (user != null) {
                    com.pdh.pojo.UserExam ue = new com.pdh.pojo.UserExam();
                    ue.setUserId(user);
                    ue.setExamId(exam);
                    ue.setStartTime(new java.util.Date());
                    ue.setEndTime(new java.util.Date());
                    ue.setScore(java.math.BigDecimal.valueOf(Math.round(score * 100.0) / 100.0));
                    userExamServices.save(ue);
                }
            }
        } catch (Exception e) {
        }
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("totalQuestions", totalQuestions);
        result.put("totalCorrect", totalCorrect);
        result.put("score", Math.round(score * 100.0) / 100.0);
        return ResponseEntity.ok(result);
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
        response.put("posts", postService.getPostsDtoByForumId(forum.getId()));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/course/{courseId}/forum/posts")
    public ResponseEntity<?> getForumPosts(@PathVariable int courseId) {
        Course course = courseService.getCourseById(courseId);
        Forum forum = forumService.getForumByCourseId(courseId);

        if (course == null || forum == null)
            return ResponseEntity.notFound().build();

        List<PostDto> posts = postService.getPostsDtoByForumId(forum.getId());
        return ResponseEntity.ok(posts);
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

        PostDto postDto = postService.getPostDtoById(newPost.getId());
        return ResponseEntity.ok(postDto);
    }

    @GetMapping("/course/{courseId}/forum/post/{postId}")
    public ResponseEntity<?> viewPost(@PathVariable int courseId, @PathVariable int postId) {
        Course course = courseService.getCourseById(courseId);
        PostDto post = postService.getPostDtoById(postId);

        if (course == null || post == null)
            return ResponseEntity.notFound().build();

        Post originalPost = postService.getPostById(postId);
        if (originalPost == null || !originalPost.getForumId().getCourseId().getId().equals(course.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post không thuộc course này.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("course", course);
        response.put("forum", originalPost.getForumId());
        response.put("post", post);
        response.put("comments", commentService.getCommentsDtoByPostId(postId));

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

    @PostMapping("/course/{courseId}/forum/post/{postId}/comments")
    public ResponseEntity<?> createComment(@PathVariable int courseId,
            @PathVariable int postId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn cần đăng nhập.");

        User currentUser = userServices.getUserByUsername(authentication.getName());
        if (currentUser == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy user.");

        Course course = courseService.getCourseById(courseId);
        Post post = postService.getPostById(postId);

        if (course == null || post == null)
            return ResponseEntity.notFound().build();

        if (!post.getForumId().getCourseId().getId().equals(course.getId()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post không thuộc course này.");

        if (!enrollmentService.isUserEnrolled(currentUser.getId(), courseId))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn chưa đăng ký khóa học.");

        String content = payload.get("content");
        if (content == null || content.trim().isEmpty())
            return ResponseEntity.badRequest().body("Nội dung bình luận không được để trống.");

        Comment newComment = new Comment();
        newComment.setContent(content.trim());
        newComment.setPostId(post);
        newComment.setUserId(currentUser);
        newComment.setCreatedAt(new Date());

        commentService.addOrUpdate(newComment);

        CommentDto commentDto = commentService.getCommentDtoById(newComment.getId());
        return ResponseEntity.ok(commentDto);
    }

    @GetMapping("/course/{courseId}/forum/post/{postId}/comments")
    public ResponseEntity<?> getPostComments(@PathVariable int courseId, @PathVariable int postId) {
        Course course = courseService.getCourseById(courseId);
        Post post = postService.getPostById(postId);

        if (course == null || post == null)
            return ResponseEntity.notFound().build();

        if (!post.getForumId().getCourseId().getId().equals(course.getId()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post không thuộc course này.");

        List<CommentDto> comments = commentService.getCommentsDtoByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/course/{courseId}/exams")
    public ResponseEntity<?> createExam(@PathVariable int courseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = authentication.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền tạo bài kiểm tra cho khóa học này");
            }

            Exam newExam = new Exam();
            newExam.setTitle((String) payload.get("title"));
            newExam.setDescription((String) payload.get("description"));
            newExam.setType((String) payload.get("type"));
            newExam.setStartDate(payload.get("startDate") != null ? new Date((Long) payload.get("startDate")) : null);
            newExam.setEndDate(payload.get("endDate") != null ? new Date((Long) payload.get("endDate")) : null);
            newExam.setDurationMinutes((Integer) payload.get("durationMinutes"));
            newExam.setIsActive(true);
            newExam.setCourseId(course);

            Exam createdExam = examService.createExam(newExam);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo bài kiểm tra thành công!");
            response.put("exam", new ExamDto(createdExam));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo bài kiểm tra: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/course/{courseId}/exam/{examId}")
    public ResponseEntity<?> updateExam(@PathVariable int courseId,
            @PathVariable int examId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = authentication.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền cập nhật bài kiểm tra này");
            }

            Exam examToUpdate = new Exam();
            examToUpdate.setTitle((String) payload.get("title"));
            examToUpdate.setDescription((String) payload.get("description"));
            examToUpdate.setType((String) payload.get("type"));
            examToUpdate
                    .setStartDate(payload.get("startDate") != null ? new Date((Long) payload.get("startDate")) : null);
            examToUpdate.setEndDate(payload.get("endDate") != null ? new Date((Long) payload.get("endDate")) : null);
            examToUpdate.setDurationMinutes((Integer) payload.get("durationMinutes"));
            examToUpdate.setIsActive((Boolean) payload.get("isActive"));

            Exam updatedExam = examService.updateExam(examId, examToUpdate);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật bài kiểm tra thành công!");
            response.put("exam", new ExamDto(updatedExam));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật bài kiểm tra: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/course/{courseId}/exam/{examId}")
    public ResponseEntity<?> deleteExam(@PathVariable int courseId, @PathVariable int examId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = auth.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền xóa bài kiểm tra này");
            }

            examService.deleteExam(examId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa bài kiểm tra thành công!");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa bài kiểm tra: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ==================== QUESTION MANAGEMENT ====================

    @PostMapping("/course/{courseId}/exam/{examId}/questions")
    public ResponseEntity<?> createQuestion(@PathVariable int courseId,
            @PathVariable int examId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = authentication.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền tạo câu hỏi cho khóa học này");
            }

            Question newQuestion = new Question();
            newQuestion.setContent((String) payload.get("content"));
            newQuestion.setPoints((Integer) payload.get("points"));
            Exam exam = examService.getExamById(examId);
            if (exam == null) {
                return ResponseEntity.status(404).body("Không tìm thấy bài kiểm tra");
            }
            newQuestion.setExamId(exam);

            Question createdQuestion = questionServices.createQuestion(newQuestion);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo câu hỏi thành công!");
            response.put("question", new QuestionDto(createdQuestion));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo câu hỏi: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/course/{courseId}/exam/{examId}/question/{questionId}")
    public ResponseEntity<?> updateQuestion(@PathVariable int courseId,
            @PathVariable int examId,
            @PathVariable int questionId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = authentication.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền cập nhật câu hỏi này");
            }

            Question questionToUpdate = new Question();
            questionToUpdate.setContent((String) payload.get("content"));
            questionToUpdate.setPoints((Integer) payload.get("points"));
            Question updatedQuestion = questionServices.updateQuestion(questionId, questionToUpdate);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật câu hỏi thành công!");
            response.put("question", new QuestionDto(updatedQuestion));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật câu hỏi: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/course/{courseId}/exam/{examId}/question/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable int courseId,
            @PathVariable int examId,
            @PathVariable int questionId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = auth.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền xóa câu hỏi này");
            }

            questionServices.deleteQuestion(questionId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa câu hỏi thành công!");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa câu hỏi: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ==================== ANSWER MANAGEMENT ====================

    @PostMapping("/course/{courseId}/exam/{examId}/question/{questionId}/answers")
    public ResponseEntity<?> createAnswer(@PathVariable int courseId,
            @PathVariable int examId,
            @PathVariable int questionId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = authentication.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền tạo đáp án cho khóa học này");
            }

            Answer newAnswer = new Answer();
            newAnswer.setContent((String) payload.get("content"));

            Object isTrueObj = payload.get("isTrue");
            Short isTrue = null;
            if (isTrueObj != null) {
                if (isTrueObj instanceof Integer) {
                    isTrue = ((Integer) isTrueObj).shortValue();
                } else if (isTrueObj instanceof Short) {
                    isTrue = (Short) isTrueObj;
                } else {
                    isTrue = Short.valueOf(isTrueObj.toString());
                }
            }
            newAnswer.setIsTrue(isTrue);

            Question question = questionServices.getQuestionById(questionId);
            if (question == null) {
                return ResponseEntity.status(404).body("Không tìm thấy câu hỏi");
            }
            newAnswer.setQuestionId(question);

            Answer createdAnswer = answerServices.createAnswer(newAnswer);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo đáp án thành công!");
            response.put("answer", new AnswerDto(createdAnswer));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo đáp án: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/course/{courseId}/exam/{examId}/question/{questionId}/answer/{answerId}")
    public ResponseEntity<?> updateAnswer(@PathVariable int courseId,
            @PathVariable int examId,
            @PathVariable int questionId,
            @PathVariable int answerId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = authentication.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền cập nhật đáp án này");
            }

            Answer answerToUpdate = new Answer();
            answerToUpdate.setContent((String) payload.get("content"));

            Object isTrueObj = payload.get("isTrue");
            Short isTrue = null;
            if (isTrueObj != null) {
                if (isTrueObj instanceof Integer) {
                    isTrue = ((Integer) isTrueObj).shortValue();
                } else if (isTrueObj instanceof Short) {
                    isTrue = (Short) isTrueObj;
                } else {
                    isTrue = Short.valueOf(isTrueObj.toString());
                }
            }
            answerToUpdate.setIsTrue(isTrue);

            Answer updatedAnswer = answerServices.updateAnswer(answerId, answerToUpdate);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật đáp án thành công!");
            response.put("answer", new AnswerDto(updatedAnswer));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật đáp án: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/course/{courseId}/exam/{examId}/question/{questionId}/answer/{answerId}")
    public ResponseEntity<?> deleteAnswer(@PathVariable int courseId,
            @PathVariable int examId,
            @PathVariable int questionId,
            @PathVariable int answerId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này");
            }

            String username = auth.getName();
            User currentUser = userServices.getUserByUsername(username);

            if (currentUser == null) {
                return ResponseEntity.status(400).body("Không tìm thấy thông tin người dùng");
            }

            Course course = courseService.getCourseById(courseId);
            if (course == null) {
                return ResponseEntity.status(404).body("Không tìm thấy khóa học");
            }

            if (!currentUser.getId().equals(course.getTeacherId().getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền xóa đáp án này");
            }

            answerServices.deleteAnswer(answerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa đáp án thành công!");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa đáp án: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
