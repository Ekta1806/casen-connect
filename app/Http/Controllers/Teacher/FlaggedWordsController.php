<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\FlaggedWord;
use Inertia\Inertia;

class FlaggedWordsController extends Controller
{
    /**
     * Display all the flagged words from the WebPurify API.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/FlaggedWords/List');
    }

    /**
     * Fetch all the flagged words.
     *
     * @return \Illuminate\Http\Jsonresponse
     */
    public function fetch()
    {
        $words = FlaggedWord::selectRaw('id, count(content) as word_usage, word_phrase,student_id,content,created_at')
            ->groupBy('student_id')
            ->groupBy('content')
            ->with('wordUsedBy:id,first_name,last_name')->has('wordUsedBy.classes')
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

        return $this->responseSuccess([
            'rows'            => $words->toArray()['data'],
            'total'           => $words->total(),
            'allData'         => $words,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }

    public function history($id)
    {
        $words       = FlaggedWord::where('id', $id)->select('content')->first();
        $flaggedword = FlaggedWord::where('content', $words->content)->get();
        return $this->responseSuccess(['flaggedword' => $flaggedword]);
    }
}
