<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\WordsRequest;
use App\Models\Admin;
use App\Models\Teacher;
use App\Models\Word as CustomFlaggedWord;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class WordsController extends Controller
{
    /**
     * Display all or the filtered/searched words.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/Words/List');
    }

    /**
     * Display the form to add a new word.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Teacher/Words/Create');
    }

    /**
     * Store the new word data.
     *
     * @param  \App\Http\Requests\Teacher\WordsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(WordsRequest $request)
    {
        try {
            $response = Http::asForm()->post('http://api1.webpurify.com/services/rest', [
                'api_key' => config('services.webpurify.license_key'),
                'method'  => 'webpurify.live.addtoblocklist',
                'word'    => $request->content_word,
                'format'  => 'json',
            ]);

            if ($response->successful()) {
                $request['created_by'] = 'teacher';
                $request['teacher_id'] = auth()->id();
                CustomFlaggedWord::create($request->all());

                return $this->responseSuccess('Word added successfully.');
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

        return Inertia::render('Teacher/Words/Show', [
            'word'    => $word,
            'addedBy' => $addedBy,
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
            return $this->responseNotFound('Word with the given id not found.');
        }

        try {
            $response = Http::asForm()->post('http://api1.webpurify.com/services/rest', [
                'api_key' => config('services.webpurify.license_key'),
                'method'  => 'webpurify.live.removefromblocklist',
                'word'    => $word->content_word,
                'format'  => 'json',
            ]);

            if ($response->successful()) {
                $word->delete();

                return $this->responseSuccess('Word deleted successfully.');
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
     * @return \Illuminate\Http\Response
     */
    public function fetch()
    {
        $words = CustomFlaggedWord::with('owner')->select(['id', 'teacher_id', 'created_by', 'content_word', 'description'])
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));
        return $this->responseSuccess([
            'rows'            => $words->toArray()['data'],
            'total'           => $words->total(),
            'allData'         => $words,
            'perPageRowCount' => (int) 1,
        ], 201);
    }
}
