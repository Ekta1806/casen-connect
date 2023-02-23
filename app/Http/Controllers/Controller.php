<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $_pageTitle = "";

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->setupPageTitle();
    }

    /**
     * Sets page title data
     *
     * @return void
     */
    protected function setupPageTitle()
    {
        Inertia::share('_pageTitle', $this->_pageTitle);
    }

    /**
     * The success response for after performing database actions.
     *
     * @param  string  $message
     * @param  array   $data
     * @return \Iluminate\Http\JsonResponse
     */
    public function responseSuccess($data = [], $message = null, $checkNumeric = true)
    {
        // $response = [
        //     'status'  => 'success',
        //     'message' => $message ?? "Done.",
        //     'data' => $data,
        // ];

        return response()->json($data,200,[], $checkNumeric ? JSON_NUMERIC_CHECK: Null);
    }

    /**
     * The not found response before performing database actions.
     *
     * @param  string  $message
     * @param  array   $data
     * @return \Iluminate\Http\JsonResponse
     */
    public function responseNotFound($message = null, $responseCode = 404, $data = [])
    {
        $mergedData = array_merge([
            'status'  => 'failed',
            'message' => $message ?? "Not found.",
        ], $data);

        return response()->json($mergedData, 404);
    }

    /**
     * The failed response while performing database actions.
     *
     * @param  string  $message
     * @param  array   $data
     * @return \Iluminate\Http\JsonResponse
     */
    public function responseFailed($message = null, $responseCode = 500, $data = [])
    {
        $mergedData = array_merge([
            'status'  => 'error',
            'message' => $message ?? "Something went wrong. Please check the log file.",
        ], $data);

        return response()->json($mergedData, $responseCode);
    }
}
