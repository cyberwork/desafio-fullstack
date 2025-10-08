<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\User;
use App\Models\Plan;
use App\Services\PlanService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ContractController extends Controller
{
    protected $planService;

    public function __construct(PlanService $planService)
    {
        $this->planService = $planService;
    }

    /**
     * Display a listing of the contracts.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Contract::with(['user', 'plan'])->get();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
    public function show(Contract $contract)
    {
        return $contract->load(['user', 'plan']);
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
            'plan_id' => 'required|exists:plans,id',
        ]);

        // Get the authenticated user (in this case, we'll use the first user)
        $user = User::first();
        $plan = Plan::findOrFail($validated['plan_id']);
        $startDate = Carbon::now();

        $contract = $this->planService->subscribeToPlan($user, $plan, $startDate);

        return response()->json($contract->load(['user', 'plan']), 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
//    public function update(Request $request, Contract $contract)
//    {
//        $validated = $request->validate([
//            'plan_id' => 'required|exists:plans,id',
//        ]);
//
//        $contract->update($validated);
//
//        return response()->json($contract->load(['user', 'plan']));
//    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
    public function destroy(Contract $contract)
    {
        $contract->delete();

        return response()->json(null, 204);
    }

    /**
     * Get the active contract for the user.
     *
     * @return \Illuminate\Http\Response
     */
    public function active()
    {
        $user = User::first();
        $contract = $user->activeContract()->with(['plan'])->first();

        return response()->json($contract);
    }

    /**
     * Switch the user's plan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function switchPlan(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $user = User::first();
        $newPlan = Plan::findOrFail($validated['plan_id']);
        $switchDate = Carbon::now();

        try {
            $newContract = $this->planService->switchPlan($user, $newPlan, $switchDate);
            return response()->json($newContract->load(['user', 'plan']), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
