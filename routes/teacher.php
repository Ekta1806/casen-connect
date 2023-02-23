<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Teacher\PostsController;
use App\Http\Controllers\Teacher\WordsController;
use App\Http\Controllers\Teacher\ClassesController;
use App\Http\Controllers\Teacher\SettingsController;
use App\Http\Controllers\Teacher\StudentsController;
use App\Http\Controllers\Teacher\DashboardController;
use App\Http\Controllers\Teacher\QuestionsController;
use App\Http\Controllers\Teacher\Auth\LoginController;
use App\Http\Controllers\Teacher\ClassPostsController;
use App\Http\Controllers\Teacher\Auth\RegisterController;
use App\Http\Controllers\Teacher\StudentVideosController;
// use App\Http\Controllers\Teacher\VideoCommentsController;
use App\Http\Controllers\Teacher\DailyQuestionsController;
use App\Http\Controllers\Teacher\ModerationController;
use App\Http\Controllers\Teacher\FlaggedWordsController;
use App\Http\Controllers\Teacher\AdminPostsController;



Route::prefix('teacher')->name('teacher')->group(function () {
    Route::middleware('guest:teacher')->group(function () {
        Route::get('/', [LoginController::class, 'redirectToLogin']);
        Route::get('/login', [LoginController::class, 'index'])->name('.login');
        Route::post('/login', [LoginController::class, 'check'])->name('.login.check');

        Route::get('/register', [RegisterController::class, 'index'])->name('.register');
        Route::post('/register', [RegisterController::class, 'store'])->name('.register.store');
    });

    Route::middleware(['auth:teacher'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('.dashboard');
        Route::get('/dashboard-card-details', [DashboardController::class, 'detailsInCard'])->name('.detailsInCard');
        Route::post('/logout', [DashboardController::class, 'logout'])->name('.logout');
        Route::get('/notifications',[DashboardController::class, 'showNotifications'])->name('.show.notification');
        Route::post('/notifications/read/{id}',[DashboardController::class, 'destroyNotification'])->name('.destroy.notification');

        Route::prefix('classes')->name('.classes')->group(function () {
            Route::get('/', [ClassesController::class, 'index']);
            Route::get('/fetch', [ClassesController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [ClassesController::class, 'create'])->name('.create');
            Route::post('/create', [ClassesController::class, 'store'])->name('.store');
            Route::get('/{id}', [ClassesController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [ClassesController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [ClassesController::class, 'update'])->name('.update');
            Route::delete('/{id}', [ClassesController::class, 'destroy'])->name('.destroy');\
            Route::get('/fetchTeacher/{track_id}', [ClassesController::class, 'fetchTeacher'])->name('.fetchTeacher');
            Route::patch('/{id}/student-progress-handler', [ClassesController::class, 'studentProgressHandler'])->name('.updateStudentProgressHandler');

            Route::post('/{id}/send-invites', [ClassesController::class, 'sendInvites'])->name('.sendInvites');
            Route::post('/{id}/{check}/likes', [ClassesController::class,'storeLikes'])->name('.likes');
            Route::delete('/{id}/students/{studentId}', [ClassesController::class, 'removeStudent'])->name('.removeStudentFromClass');
            Route::get('/{teacher}/profile', [ClassesController::class,'teacherProfile'])->name('.profile');
            Route::get('/{admin}/adminProfile', [ClassesController::class,'adminProfile'])->name('.adminProfile');
        });

        Route::prefix('class-posts')->name('.classPosts')->group(function () {
            Route::get('/', [ClassPostsController::class, 'index']);
            //Route::get('/fetch', [ClassPostsController::class, 'fetch'])->name('.fetch');
            Route::get('/create/{classId?}', [ClassPostsController::class, 'create'])->name('.create');
            Route::post('/create', [ClassPostsController::class, 'store'])->name('.store');
            Route::get('/{id}', [ClassPostsController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [ClassPostsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [ClassPostsController::class, 'update'])->name('.update');
            Route::delete('/{id}', [ClassPostsController::class, 'destroy'])->name('.destroy');
            Route::delete('/{postId}/{mediaId}', [ClassPostsController::class, 'deleteMedia'])->name('.deleteMedia');
            Route::get('/posts/{postId}/pendingcomments', [ClassPostsController::class, 'fetchPendingComments'])->name('.fetchPendingComments');
            Route::patch('/pendingComments/{commentId}/{approveReject}', [ClassPostsController::class, 'approveRejectPendingComment'])->name('.approveRejectPendingComment');
            Route::post('/teacher/posts/store', [ClassPostsController::class, 'storeComment'])->name('.comments.store');
            Route::delete('/teacher/{classPostsComment}/destroy', [ClassPostsController::class,'destroyComment'])->name('.comment.destroy');
            Route::patch('/teacher/{classPostsComment}/update', [ClassPostsController::class, 'updateComment'])->name('.comment.update');
            Route::post('/teacher/like/{id}/{check}', [ClassPostsController::class,'storeLikes'])->name('.likes');
            Route::post('/teacher/teacherlike/{id}/{check}', [ClassPostsController::class,'storeTeacherLikes'])->name('.teacherLikes');
            //Route::post('/{id}/{check}/like', [ClassPostsController::class,'storeLikes'])->name('.classPosts.likes');
            Route::patch('{id}/{isPinPost}/{classId}', [ClassPostsController::class,'pinPost'])->name('.pinpost');
            Route::get('/classpost/tagdata/{id}', [ClassPostsController::class, 'taggedData'])->name('.taggedData');
            Route::get('/tagSomeone/{id}', [ClassPostsController::class, 'tagSomeone'])->name('.tagSomeone');
        });

        Route::prefix('flagged-words')->name('.flaggedWords')->group(function () {
            Route::get('/', [FlaggedWordsController::class, 'index']);
            Route::get('/fetch', [FlaggedWordsController::class, 'fetch'])->name('.fetch');
            Route::get('/history/{id}', [FlaggedWordsController::class, 'history'])->name('.history');
        });
        
        Route::prefix('students')->name('.students')->group(function () {
            Route::get('/', [StudentsController::class, 'index']);
            Route::get('/fetch', [StudentsController::class, 'fetch'])->name('.fetch');
            Route::get('/{studentId}', [StudentsController::class, 'show'])->name('.show');
            Route::get('/comments/{studentId}', [StudentsController::class, 'fetchPostComments'])->name('.show.comment');
            Route::get('/{studentId}/edit', [StudentsController::class, 'edit'])->name('.edit');
            Route::patch('/{studentId}', [StudentsController::class, 'update'])->name('.update');
            Route::patch('/{studentId}/change-password', [StudentsController::class, 'changePassword'])->name('.changePassword');
            Route::delete('/{studentId}/delete-avatar', [StudentsController::class, 'deleteAvatar'])->name('.deleteAvatar');
            Route::get('/students/tagdata/{id}', [StudentsController::class, 'studentTaggedData'])->name('.studentTaggedData');
        });

        Route::prefix('student/videos')->name('.studentVideos')->group(function () {
            Route::get('/', [StudentVideosController::class, 'index']);
            Route::get('/fetch', [StudentVideosController::class, 'fetch'])->name('.fetch');
            // Route::post('/{id}/comments', [VideoCommentsController::class, 'store'])->name('.comments.store');
            // Route::delete('/{id}/comments/{commentId}', [VideoCommentsController::class, 'destroy'])->name('.comments.destroy');
            Route::get('/{id}', [StudentVideosController::class, 'show'])->name('.show');
            Route::delete('/{id}', [StudentVideosController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('questions')->name('.questions')->group(function () {
            Route::get('/', [QuestionsController::class, 'index']);
            Route::get('/fetch', [QuestionsController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [QuestionsController::class, 'create'])->name('.create');
            Route::post('/create', [QuestionsController::class, 'store'])->name('.store');
            Route::get('/{id}', [QuestionsController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [QuestionsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [QuestionsController::class, 'update'])->name('.update');
            Route::delete('/{id}', [QuestionsController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('daily-questions')->name('.dailyQuestions')->group(function () {
            Route::get('/', [DailyQuestionsController::class, 'index']);
            Route::get('/fetch/{level_id?}/{class_id?}', [DailyQuestionsController::class, 'fetch'])->name('.fetch');
            Route::get('/fetch-all', [DailyQuestionsController::class, 'fetchAll'])->name('.fetchAll');
            Route::get('/create', [DailyQuestionsController::class, 'create'])->name('.create');
            Route::post('/create', [DailyQuestionsController::class, 'store'])->name('.store');
            Route::get('/{id}', [DailyQuestionsController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [DailyQuestionsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [DailyQuestionsController::class, 'update'])->name('.update');
            Route::patch('/{id}/{approveReject}', [DailyQuestionsController::class, 'approveRejectAnswer'])->name('.approveRejectAnswer');
            Route::delete('/{id}', [DailyQuestionsController::class, 'destroy'])->name('.destroy');
            Route::get('/getstudent/{id}/{level_id?}', [DailyQuestionsController::class, 'getStudents'])->name('.getStudents');
        });

        Route::prefix('settings')->name('.settings')->group(function () {
            Route::get('/', [SettingsController::class, 'edit']);
            Route::patch('/', [SettingsController::class, 'update'])->name('.update');
            Route::patch('/change-password', [SettingsController::class, 'changePassword'])->name('.changePassword');
            Route::delete('/delete-avatar', [SettingsController::class, 'deleteAvatar'])->name('.deleteAvatar');
        });

        Route::prefix('words')->name('.words')->group(function () {
            Route::get('/', [WordsController::class, 'index']);
            Route::get('/fetch', [WordsController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [WordsController::class, 'create'])->name('.create');
            Route::post('/create', [WordsController::class, 'store'])->name('.store');
            Route::get('/{id}', [WordsController::class, 'show'])->name('.show');
            Route::delete('/{id}', [WordsController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('moderation')->name('.moderation')->group(function () {
            Route::get('/', [ModerationController::class, 'index']);
            Route::get('/fetch-pending-posts', [ModerationController::class, 'fetchPendingPosts'])->name('.fetchPendingPosts');
        });

        Route::prefix('adminposts')->name('.adminposts')->group(function () {
            Route::get('/', [AdminPostsController::class, 'index']);
            Route::get('/admin/web/purify',[AdminPostsController::class, 'checkWords'])->name('.checkwords');
            Route::post('/teacher/like/{id}/{check}', [AdminPostsController::class,'storeLikes'])->name('.likes');
            Route::get('/{id}', [AdminPostsController::class, 'adminComments'])->name('.comments');
            Route::post('/comment/store', [AdminPostsController::class,'storeComment'])->name('.comment.store');
            Route::delete('/destroy/{comment}', [AdminPostsController::class,'destroyComment'])->name('.comment.destroy');
            Route::patch('/{comment}/update', [AdminPostsController::class, 'updateComment'])->name('.comment.update');
            Route::get('/tagdata/{id}', [AdminPostsController::class, 'tagStudents'])->name('.tagStudents');
            Route::get('/{adminPostsLike}/post/likes', [AdminPostsController::class, 'showLikes'])->name('.showLikes');
            Route::get('/tagged/posts/{post}', [AdminPostsController::class,'show'])->name('.show');
        });


        Route::get('/posts/{postId}/likes', [PostsController::class, 'fetchLikes'])->name('.posts.likes.fetch');
        Route::get('/posts/{postId}/comments', [PostsController::class, 'fetchComments'])->name('.posts.comments.fetch');
        Route::patch('/posts/{postId}/{approveReject}', [PostsController::class, 'approveReject'])->name('.posts.approveReject');
        Route::patch('/comments/{commentId}/{approveReject}', [PostsController::class, 'approveRejectComment'])->name('.comments.approveRejectComment');
        Route::get('/notes/{postId}', [PostsController::class, 'getnotes'])->name('.posts.notes');
        Route::get('/comments/notes/{commentId}', [PostsController::class, 'getCommentNotes'])->name('.comments.notes');
        Route::get('/classposts/comments/notes/{commentId}', [PostsController::class, 'getClassPostCommentNotes'])->name('.classposts.comments.notes');
        Route::get('/{id}', [PostsController::class, 'studentComments'])->name('.studentComments');
        Route::post('/', [PostsController::class,'storeComments'])->name('.comment.store');
        Route::delete('/destroy/{comment}', [PostsController::class,'destroy'])->name('.comment.destroy');
        Route::patch('/{comment}/update', [PostsController::class, 'update'])->name('.comment.update');
        Route::get('/{classPostsLike}/post/likes', [PostsController::class, 'show'])->name('.posts.likes');
        Route::get('/tagged/posts/{post}', [PostsController::class,'showPost'])->name('.posts.show');
        Route::get('/tagged/classpost/{classPost}', [PostsController::class,'classPostShow'])->name('.classPost.show');    
    });
});
