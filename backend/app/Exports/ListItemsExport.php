<?php

namespace App\Exports;

use App\Models\ListItem;
use Maatwebsite\Excel\Concerns\FromCollection;

class ListItemsExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return ListItem::all();
    }

    function headings(): array
    {
        return [
            'ID',
            'Listing ID',
            'Inscription ID',
            'Group ID',
            'Created At',
            'Updated At',
        ];
    }

    
}
