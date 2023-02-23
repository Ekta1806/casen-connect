<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CustomFlaggedWordsRequest;
use App\Models\Admin;
use App\Models\Teacher;
use App\Models\Word as CustomFlaggedWord;
use Inertia\Inertia;

class CustomFlaggedWordsController extends Controller
{
    /**
     * Display all or the filtered/searched words.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/CustomFlaggedWords/List');
    }

    /**
     * Display the form to add a new word.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/CustomFlaggedWords/Create');
    }

    /**
     * Store the new word data.
     *
     * @param  \App\Http\Requests\Admin\CustomFlaggedWordsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(CustomFlaggedWordsRequest $request)
    {
        try {
            $response = CustomFlaggedWord::webpurify($request->content_word);
            if ($response->successful()) {
                $request['created_by'] = 'admin';
                $request['admin_id']   = auth()->id();
                CustomFlaggedWord::create($request->all());

                return $this->responseSuccess('Custom Flagged Word added successfully.');
            }

            return $this->responseFailed('Error from WebPurify.', 201);
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the word data of the given word id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        $word = CustomFlaggedWord::find($id);
        if (!$word) {
            abort(404);
        }

        $addedBy = null;
        if ($word->created_by == 'admin') {
            $addedBy = Admin::find($word->admin_id);
        }

        if ($word->created_by == 'teacher') {
            $addedBy = Teacher::find($word->teacher_id);
        }

        return Inertia::render('Admin/CustomFlaggedWords/Show', [
            'customFlaggedWord' => $word,
            'addedBy'           => $addedBy,
        ]);
    }

    /**
     * Delete the word data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $word = CustomFlaggedWord::find($id);
        if (!$word) {
            return $this->responseNotFound('Custom Flagged Word with the given id not found.');
        }
        try {
            $response = CustomFlaggedWord::webpurify($word->content_word);

            if ($response->successful()) {
                $word->delete();

                return $this->responseSuccess('Custom Flagged Word deleted successfully.');
            }

            return $this->responseFailed('Error from WebPurify.', 201);
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the words.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $words = CustomFlaggedWord::with('owner')
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $words->toArray()['data'],
            'total'           => $words->total(),
            'allData'         => $words,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
}
