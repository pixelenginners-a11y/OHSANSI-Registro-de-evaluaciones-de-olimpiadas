<?php

namespace App\Http\Controllers;

use App\Models\ListItem;
use App\Services\ListItemService;
use Illuminate\Http\Request;

class ListItemController extends Controller
{
    public function __construct(
      private ListItemService $listItemService
    )
    {}
    /**
     * Display a listing of the resource.
     */
    public function index(int $id)
    {
        $listItems = $this->listItemService->getListItems($id);
        return response()->json($listItems);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ListItem $listItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ListItem $listItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ListItem $listItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ListItem $listItem)
    {
        //
    }
}
