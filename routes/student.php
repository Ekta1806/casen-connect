<?php 

use App\Http\Controllers\Auth\Student\LoginController;
use App\Http\Controllers\Auth\Student\RegisterController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\SettingController;
use App\Http\Controllers\Student\PostController;
use App\Http\Controllers\StudentAnswersController;
use App\Http\Controllers\Student\ClassController;
use App\Http\Controllers\Student\CommentController;
use App\Http\Controllers\Student\VideoController;
use App\Http\Controllers\ClassPostsCommentController;
use App\Http\Controllers\ClassPostsLikeController;
use App\Http\Controllers\Student\AdminPostsController;
use Illuminate\Support\Facades\Route;



Route::middleware(['auth:student'])->prefix('student')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('student.logout');
    Route::get('/home', [StudentController::class, 'index'])->name('student.home');
    Route::get('/student/getQuestionOftheDay',[StudentController::class, 'getQuestionOftheDay'])->name('student.getQuestion');
    Route::get('/student/details',[StudentController::class, 'details'])->name('student.details');
    Route::post('/question/student/create', [StudentAnswersController::class, 'store'])->name('student.question.store');
    Route::get('/student/news',[StudentController::class, 'news'])->name('student.news');
    Route::get('/student/show/news',[StudentController::class, 'showNews'])->name('student.show.news');
    Route::get('/notifications',[StudentController::class, 'showNotifications'])->name('show.notification');
    Route::post('notifications/read/{id}',[StudentController::class, 'destroyNotification'])->name('destroy.notification');
    Route::post('/checklist/create', [StudentController::class, 'storeCheckList'])->name('student.checklist.store');
    Route::post('/checklist/update', [StudentController::class, 'updateCheckList'])->name('student.checklist.update');

    Route::prefix('post')->group(function () {
        Route::get('/', [PostController::class, 'postList'])->name('student.posts');
        Route::post('/save', [PostController::class, 'store'])->name('post.store');
        Route::get('web/purify',[PostController::class, 'checkWords'])->name('checkwords');
        Route::get('/{post}/{tag}', [PostController::class,'edit'])->name('post.edit');
        Route::patch('/{post}/update', [PostController::class, 'update'])->name('post.update');
        Route::delete('/{post}', [PostController::class,'destroy'])->name('post.destroy');
        Route::delete('/photos/{media}', [PostController::class,'destroyMedia'])->name('media.destroy');
        Route::get('/tagged/posts/{post}', [PostController::class,'show'])->name('posts.show');
        Route::get('/tagged/classpost/{classPost}', [PostController::class,'classPostShow'])->name('classPost.show');
        Route::get('/{postId}/notes', [PostController::class, 'getnotes'])->name('student.posts.notes');
        Route::get('/teacher/notes/{postId}', [PostController::class, 'getnotes'])->name('student.posts.notes');
        Route::get('/teacher/comments/notes/{commentId}', [PostController::class, 'getCommentNotes'])->name('student.comments.notes');
        Route::get('/teacher/classposts/comments/notes/{commentId}', [PostController::class, 'getClassPostCommentNotes'])->name('student.classposts.comments.notes');
        Route::get('/tagsomeone', [PostController::class, 'tagSomeone'])->name('student.post.tagSomeone');
    });

    Route::prefix('comments')->group(function () {
        Route::get('/{id}', [CommentController::class, 'index'])->name('comments');
        Route::get('/teacher/posts/{id}', [ClassPostsCommentController::class, 'index'])->name('teacher.posts.comments');
        Route::post('/teacher/posts/store', [ClassPostsCommentController::class, 'store'])->name('teacher.comments.store');
        Route::patch('/teacher/{classPostsComment}/update', [ClassPostsCommentController::class, 'update'])->name('student.teacher.comment.update');
        Route::patch('/{comment}/update', [CommentController::class, 'update'])->name('comment.update');
        Route::post('/', [CommentController::class,'store'])->name('comment.store');
        Route::delete('/destroy/{comment}', [CommentController::class,'destroy'])->name('comment.destroy');
        Route::delete('/teacher/{classPostsComment}/destroy', [ClassPostsCommentController::class,'destroy'])->name('student.teacher.comment.destroy');
        Route::post('/like/{id}/{check}', [PostController::class,'storeLike'])->name('likes');
        Route::post('/teacher/like/{id}/{check}', [ClassPostsLikeController::class,'store'])->name('teacher.post.likes');
        Route::get('/like/{post}', [PostController::class,'show'])->name('likes.show');
        Route::get('/posts/{postId}/likes', [CommentController::class, 'fetchLikes'])->name('posts.likes.fetch');
        Route::get('/{classPostsLike}/post/likes', [ClassPostsLikeController::class, 'show'])->name('student.posts.likes');
        Route::post('/student/like/{id}/{check}', [ClassPostsLikeController::class,'storeLikes'])->name('teacherProfile.likes');
    });

    Route::get('/members', [ClassController::class,'index'])->name('members');
    Route::get('/class/questions', [ClassController::class,'questions'])->name('class.questions');
    Route::get('/{members}/profile', [ClassController::class,'studentProfile'])->name('members.profile');
    Route::get('/{teacher}/teacherProfile', [ClassController::class,'teacherProfile'])->name('teacher.profile');
    Route::get('/{admin}/adminProfile', [ClassController::class,'adminProfile'])->name('admin.profile');
    Route::get('/Review/Questions', [ClassController::class,'reviewQuestion'])->name('questions.review');

    
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index'])->name('student.settings');
        Route::post('/update', [SettingController::class, 'update'])->name('student.setupdate');
        Route::delete('/remove/photo/{id}', [SettingController::class, 'destroy'])->name('student.remove');
    });

    Route::prefix('adminposts')->group(function () {
        Route::get('/{adminPostsLike}/adminpost/likes', [AdminPostsController::class, 'showLikes'])->name('student.adminposts.showLikes');
        Route::post('/adminpostlike/{id}/{check}', [AdminPostsController::class,'storeLikes'])->name('student.adminposts.likes');
        // Route::get('/{postId}/likes', [AdminPostsController::class, 'fetchLikes'])->name('adminposts.likes.fetch');
        Route::patch('/{comment}/update', [AdminPostsController::class, 'updateComment'])->name('student.adminposts.comment.update');
        Route::get('/adminComments/{id}', [AdminPostsController::class, 'adminComments'])->name('student.adminposts.comments');
        Route::post('/comment/store', [AdminPostsController::class,'storeComment'])->name('student.adminposts.comment.store');
        Route::delete('/destroy/{comment}', [AdminPostsController::class,'destroyComment'])->name('student.adminposts.comment.destroy');
        Route::get('/studenttagdata/{id}', [AdminPostsController::class, 'tagStudents'])->name('student.adminposts.tagStudents');
        Route::get('/tagged/posts/{post}', [AdminPostsController::class,'show'])->name('student.adminposts.show');
    });

});

Route::prefix('student')->middleware(['guest:student'])->group(function () {
    Route::get('/', [LoginController::class, 'redirectToLogin']);
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('student.login');
    Route::post('/login', [LoginController::class, 'login'])->name('student.store');
    Route::get('/register', [RegisterController::class, 'register'])->name('studregister');
    Route::post('/studregister', [RegisterController::class, 'create'])->name('student.register');
});



