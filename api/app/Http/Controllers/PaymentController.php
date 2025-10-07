<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Contract;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the payments.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Payment::with(['contract'])->get();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function show(Payment $payment)
    {
        return $payment->load(['contract']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_id' => 'required|exists:contracts,id',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'payment_date' => 'nullable|date',
            'paid' => 'boolean',
        ]);

        $payment = Payment::create($validated);

        return response()->json($payment->load(['contract']), 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'contract_id' => 'exists:contracts,id',
            'amount' => 'numeric|min:0',
            'due_date' => 'date',
            'payment_date' => 'nullable|date',
            'paid' => 'boolean',
        ]);

        $payment->update($validated);

        return response()->json($payment->load(['contract']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json(null, 204);
    }

    /**
     * Get payments for a specific contract.
     *
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
    public function forContract(Contract $contract)
    {
        $payments = $contract->payments;

        return response()->json($payments);
    }

    /**
     * Process a payment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function processPayment(Request $request, Payment $payment)
    {
        $payment->update([
            'paid' => true,
            'payment_date' => now(),
        ]);

        return response()->json($payment->load(['contract']));
    }
}
