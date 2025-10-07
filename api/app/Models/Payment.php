<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Contract;

class Payment extends Model
{
    protected $fillable = [
        'contract_id',
        'amount',
        'due_date',
        'payment_date',
        'paid'
    ];

    protected $casts = [
        'due_date' => 'date',
        'payment_date' => 'date',
        'paid' => 'boolean'
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
