<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\PostsController;
use App\Http\Controllers\Admin\AdminsController;
use App\Http\Controllers\Admin\LevelsController;
use App\Http\Controllers\Admin\TracksController;
use App\Http\Controllers\Admin\AnswersController;
use App\Http\Controllers\Admin\ClassesController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StudentsController;
use App\Http\Controllers\Admin\TeachersController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\QuestionsController;
use App\Http\Controllers\Admin\FlaggedWordsController;
use App\Http\Controllers\Admin\SiteSettingsController;
use App\Http\Controllers\Admin\StudentVideosController;
// use App\Http\Controllers\Admin\VideoCommentsController;
use App\Http\Controllers\Admin\DailyQuestionsController;
use App\Http\Controllers\Admin\CustomFlaggedWordsController;
use App\Http\Controllers\Admin\IntakeQuestionsController;
use App\Http\Controllers\Admin\AdminPostsController;
use App\Http\Controllers\Admin\ClassPostsController;

Route::prefix('admin')->name('admin')->group(function () {
    Route::middleware(['guest:admin'])->group(function () {
        Route::get('/classesTeacher', [AdminsController::class, 'classesTeacher']);
        Route::get('/', [LoginController::class, 'redirectToLogin']);
        Route::get('/login', [LoginController::class, 'index'])->name('.login');
        Route::post('/login', [LoginController::class, 'store'])->name('.login.store');
        Route::get('/login/{id}', [LoginController::class, 'login'])->name('admin.student.store');

    });

    Route::middleware(['auth:admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('.dashboard');
        Route::get('/dashboard-card-details', [DashboardController::class, 'detailsInCard'])->name('.detailsInCard');
        Route::post('/logout', [DashboardController::class, 'logout'])->name('.logout');

        Route::prefix('tracks')->name('.tracks')->group(function () {
            Route::get('/', [TracksController::class, 'index']);
            Route::get('/fetch', [TracksController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [TracksController::class, 'create'])->name('.create');
            Route::post('/create', [TracksController::class, 'store'])->name('.store');
            Route::get('/{id}', [TracksController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [TracksController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [TracksController::class, 'update'])->name('.update');
            Route::delete('/{id}', [TracksController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('levels')->name('.levels')->group(function () {
            Route::get('/', [LevelsController::class, 'index']);
            Route::get('/fetch', [LevelsController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [LevelsController::class, 'create'])->name('.create');
            Route::post('/create', [LevelsController::class, 'store'])->name('.store');
            Route::get('/{id}', [LevelsController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [LevelsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [LevelsController::class, 'update'])->name('.update');
            Route::delete('/{id}', [LevelsController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('admins')->name('.admins')->group(function () {
            Route::get('/', [AdminsController::class, 'index']);
            Route::get('/fetch', [AdminsController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [AdminsController::class, 'create'])->name('.create');
            Route::post('/create', [AdminsController::class, 'store'])->name('.store');
            Route::get('/{id}', [AdminsController::class, 'show'])->name('.show');
            Route::patch('/{id}/change-password', [AdminsController::class, 'changePassword'])->name('.changePassword');
            Route::delete('/{id}/delete-avatar', [AdminsController::class, 'deleteAvatar'])->name('.deleteAvatar');
            Route::get('/{id}/edit', [AdminsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [AdminsController::class, 'update'])->name('.update');
            Route::delete('/{id}', [AdminsController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('adminposts')->name('.adminposts')->group(function () {
            Route::get('/', [AdminPostsController::class, 'index']);
            Route::get('/create/{classId?}', [AdminPostsController::class, 'create'])->name('.create');
            Route::post('/create', [AdminPostsController::class, 'store'])->name('.store');
            Route::get('/{id}/edit', [AdminPostsController::class, 'edit'])->name('.edit');
            Route::patch('/update/{id}', [AdminPostsController::class, 'update'])->name('.update');
            Route::delete('/delete/{id}', [AdminPostsController::class, 'destroy'])->name('.destroy');
            Route::get('/admin/web/purify',[AdminPostsController::class, 'checkWords'])->name('.checkwords');
            Route::post('/admin/like/{id}/{check}', [AdminPostsController::class,'storeLikes'])->name('.likes');
            Route::get('/{id}', [AdminPostsController::class, 'adminComments'])->name('.comments');
            Route::post('/comment/store', [AdminPostsController::class,'storeComment'])->name('.comment.store');
            Route::delete('/destroy/{comment}', [AdminPostsController::class,'destroyComment'])->name('.comment.destroy');
            Route::patch('/{comment}/update', [AdminPostsController::class, 'updateComment'])->name('.comment.update');
            Route::delete('/{postId}/{mediaId}', [AdminPostsController::class, 'deleteMedia'])->name('.deleteMedia');
            Route::get('/{adminPostsLike}/post/likes', [AdminPostsController::class, 'showLikes'])->name('.showLikes');
            Route::get('/tagdata/{id}', [AdminPostsController::class, 'tagStudents'])->name('.tagStudents');
            Route::get('/tagged/posts/{post}', [AdminPostsController::class,'show'])->name('.show');
            Route::post('/tagSomeone', [AdminPostsController::class, 'tagSomeone'])->name('.tagSomeone');
        });

        Route::prefix('teachers')->name('.teachers')->group(function () {
            Route::get('/', [TeachersController::class, 'index']);
            Route::get('/fetch', [TeachersController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [TeachersController::class, 'create'])->name('.create');
            Route::post('/create', [TeachersController::class, 'store'])->name('.store');
            Route::get('/{id}', [TeachersController::class, 'show'])->name('.show');
            Route::patch('/{id}/change-password', [TeachersController::class, 'changePassword'])->name('.changePassword');
            Route::delete('/{id}/delete-avatar', [TeachersController::class, 'deleteAvatar'])->name('.deleteAvatar');
            Route::get('/{id}/edit', [TeachersController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [TeachersController::class, 'update'])->name('.update');
            Route::delete('/{id}', [TeachersController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('students')->name('.students')->group(function () {
            Route::get('/', [StudentsController::class, 'index']);
            Route::get('/fetch', [StudentsController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [StudentsController::class, 'create'])->name('.create');
            Route::post('/create', [StudentsController::class, 'store'])->name('.store');
            Route::get('/{id}', [StudentsController::class, 'show'])->name('.show');
            Route::patch('/{id}/change-password', [StudentsController::class, 'changePassword'])->name('.changePassword');
            Route::delete('/{id}/delete-avatar', [StudentsController::class, 'deleteAvatar'])->name('.deleteAvatar');
            Route::get('/{id}/edit', [StudentsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [StudentsController::class, 'update'])->name('.update');
            Route::delete('/{id}', [StudentsController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('classes')->name('.classes')->group(function () {
            Route::get('/', [ClassesController::class, 'index']);
            Route::get('/fetch', [ClassesController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [ClassesController::class, 'create'])->name('.create');
            Route::post('/create', [ClassesController::class, 'store'])->name('.store');
            Route::get('/{id}', [ClassesController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [ClassesController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [ClassesController::class, 'update'])->name('.update');
            Route::delete('/{id}', [ClassesController::class, 'destroy'])->name('.destroy');
            Route::get('/fetchTeacher/{track_id}', [ClassesController::class, 'fetchTeacher'])->name('.fetchTeacher');
            Route::patch('/{id}/student-progress-handler', [ClassesController::class, 'studentProgressHandler'])->name('.updateStudentProgressHandler');
            Route::delete('/{id}/students/{studentId}', [ClassesController::class, 'removeStudent'])->name('.removeStudentFromClass');
            Route::post('/{id}/send-invites', [ClassesController::class, 'sendInvites'])->name('.sendInvites');
        });

        Route::prefix('student-videos')->name('.studentVideos')->group(function () {
            Route::get('/', [StudentVideosController::class, 'index']);
            Route::get('/fetch', [StudentVideosController::class, 'fetch'])->name('.fetch');
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
        Route::prefix('intake-questions')->name('.intakeQuestions')->group(function () {
            Route::get('/', [IntakeQuestionsController::class, 'index']);
            Route::get('/create', [IntakeQuestionsController::class, 'create'])->name('.create');
            Route::post('/create', [IntakeQuestionsController::class, 'store'])->name('.store');
            Route::get('/fetch', [IntakeQuestionsController::class, 'fetch'])->name('.fetch');
            Route::get('/{id}', [IntakeQuestionsController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [IntakeQuestionsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [IntakeQuestionsController::class, 'update'])->name('.update');
            Route::delete('/{id}', [IntakeQuestionsController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('daily-questions')->name('.dailyQuestions')->group(function () {
            Route::get('/', [DailyQuestionsController::class, 'index']);
            Route::get('/fetch-all', [DailyQuestionsController::class, 'fetchAll'])->name('.fetchAll');
            Route::get('/fetch/{level_id?}/{class_id?}', [DailyQuestionsController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [DailyQuestionsController::class, 'create'])->name('.create');
            Route::post('/store', [DailyQuestionsController::class, 'store'])->name('.store');
            Route::get('/{id}', [DailyQuestionsController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [DailyQuestionsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [DailyQuestionsController::class, 'update'])->name('.update');
            Route::patch('/{id}/{approveReject}', [DailyQuestionsController::class, 'approveRejectAnswer'])->name('.approveRejectAnswer');
            Route::delete('/{id}', [DailyQuestionsController::class, 'destroy'])->name('.destroy');
            Route::get('/getstudent/{id}/{level_id?}', [DailyQuestionsController::class, 'getStudents'])->name('.getStudents');
        });

        Route::prefix('notes')->name('.answers')->group(function () {
            Route::get('/', [AnswersController::class, 'index']);
            Route::get('/fetch', [AnswersController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [AnswersController::class, 'create'])->name('.create');
            Route::post('/create', [AnswersController::class, 'store'])->name('.store');
            Route::get('/{id}', [AnswersController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [AnswersController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [AnswersController::class, 'update'])->name('.update');
            Route::delete('/{id}', [AnswersController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('flagged-words')->name('.flaggedWords')->group(function () {
            Route::get('/', [FlaggedWordsController::class, 'index']);
            Route::get('/fetch', [FlaggedWordsController::class, 'fetch'])->name('.fetch');
            Route::get('/history/{id}', [FlaggedWordsController::class, 'history'])->name('.history');
        });

        Route::prefix('site-settings')->name('.siteSettings')->group(function () {
            Route::get('/', [SiteSettingsController::class, 'index']);
            Route::patch('/', [SiteSettingsController::class, 'update'])->name('.update');
        });

        Route::prefix('news')->name('.news')->group(function () {
            Route::get('/', [NewsController::class, 'index']);
            Route::get('/fetch', [NewsController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [NewsController::class, 'create'])->name('.create');
            Route::post('/create', [NewsController::class, 'store'])->name('.store');
            Route::get('/{id}', [NewsController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [NewsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [NewsController::class, 'update'])->name('.update');
            Route::delete('/{id}', [NewsController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('custom-flagged-words')->name('.customFlaggedWords')->group(function () {
            Route::get('/', [CustomFlaggedWordsController::class, 'index']);
            Route::get('/fetch', [CustomFlaggedWordsController::class, 'fetch'])->name('.fetch');
            Route::get('/create', [CustomFlaggedWordsController::class, 'create'])->name('.create');
            Route::post('/create', [CustomFlaggedWordsController::class, 'store'])->name('.store');
            Route::get('/{id}', [CustomFlaggedWordsController::class, 'show'])->name('.show');
            Route::get('/{id}/edit', [CustomFlaggedWordsController::class, 'edit'])->name('.edit');
            Route::patch('/{id}', [CustomFlaggedWordsController::class, 'update'])->name('.update');
            Route::delete('/{id}', [CustomFlaggedWordsController::class, 'destroy'])->name('.destroy');
        });

        Route::prefix('settings')->name('.settings')->group(function () {
            Route::get('/', [SettingsController::class, 'edit']);
            Route::patch('/', [SettingsController::class, 'update'])->name('.update');
            Route::patch('/change-password', [SettingsController::class, 'changePassword'])->name('.changePassword');
            Route::delete('/delete-avatar', [SettingsController::class, 'deleteAvatar'])->name('.deleteAvatar');
        });

        Route::get('/posts/{postId}/likes/{modelName}', [PostsController::class, 'fetchLikes'])->name('.posts.likes.fetch');
        Route::get('/posts/{postId}/comments', [PostsController::class, 'fetchComments'])->name('.posts.comments.fetch');
        Route::get('/notes/{postId}', [PostsController::class, 'getnotes'])->name('.posts.notes');
        Route::get('/classes/teacher/posts/{postId}/comments', [PostsController::class, 'fetchPostsComments'])->name('.posts.teacher.class.comments.fetch');
        Route::get('/comments/class/notes/{commentId}', [PostsController::class, 'getClassPostCommentNotes'])->name('.comments.notes.fetch');
        Route::get('/comments/notes/{commentId}', [PostsController::class, 'getPostCommentNotes'])->name('.comments.notes.posts.fetch');
        Route::get('/{members}/studentProfile', [PostsController::class,'studentProfile'])->name('.student.profile');
        Route::get('/{teacherProfile}/teacherProfile', [PostsController::class,'teacherProfile'])->name('.teacher.profile');
        Route::get('/{admin}/adminProfile', [PostsController::class,'adminProfile'])->name('.adminProfile');
        Route::post('/admin/like/{id}/{check}', [PostsController::class,'storeLikes'])->name('.post.likes');
        Route::get('/{PostsLike}/post/likes', [PostsController::class, 'showPostLikes'])->name('.posts.showlikes');
        Route::post('/admin/comment', [PostsController::class,'storeComment'])->name('.comment.store');
        Route::delete('/post/destroy/{comment}', [PostsController::class,'destroyComment'])->name('.comment.destroy');
        Route::patch('/{comment}/update', [PostsController::class, 'updateComment'])->name('.comment.update');
    
        Route::post('/classpost/like/{id}/{check}', [ClassPostsController::class,'storeLikes'])->name('.classposts.likes');
        Route::get('/{PostsLike}/classpost/likes', [ClassPostsController::class, 'showPostLikes'])->name('.classposts.showlikes');
        Route::post('/admin/classpostcomment', [ClassPostsController::class,'storeComment'])->name('.classpostscomment.store');
        Route::delete('/classpost/destroy/{comment}', [ClassPostsController::class,'destroyComment'])->name('.classpostscomment.destroy');
        Route::patch('/classpost/{comment}/update', [ClassPostsController::class, 'updateComment'])->name('.classpostscomment.update');
    });
});
