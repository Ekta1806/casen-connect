<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsRequest;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use DB;

class NewsController extends Controller
{
    /**
     * Display all or the filtered/searched news.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/News/List');
    }

    /**
     * Display the form to add a new news.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/News/Create');
    }

    /**
     * Store the new news data.
     *
     * @param  \App\Http\Requests\Admin\NewsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(NewsRequest $request)
    {
        try {
            $request['slug'] = Str::slug($request->title);
            News::create($request->all());

            return $this->responseSuccess('News added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the news data of the given news id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        $news = News::find($id);
        if (!$news) {
            abort(404);
        }

        return Inertia::render('Admin/News/Show', [
            'news' => $news,
        ]);
    }

    /**
     * Display the edit news form of the given news id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $news = News::find($id);
        if (!$news) {
            abort(404);
        }

        return Inertia::render('Admin/News/Edit', [
            'news' => $news,
        ]);
    }

    /**
     * Update the news data of the given news id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\NewsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, NewsRequest $request)
    {
        $news = News::find($id);
        if (!$news) {
            return $this->responseNotFound('News with the given id not found.');
        }

        try {
            $news->update($request->all());

            return $this->responseSuccess('News updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the news data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $news = News::find($id);
        if (!$news) {
            return $this->responseNotFound('News not found with the given id.');
        }

        try {
            $news->delete();

            return $this->responseSuccess('News deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the news.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $news = News::select(['id', 'title', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as post_date")])
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $news->toArray()['data'],
            'total'           => $news->total(),
            'allData'         => $news,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
}
