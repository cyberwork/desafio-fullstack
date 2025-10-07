<?php

namespace App\Services;

use App\Models\User;
use App\Models\Plan;
use App\Models\Contract;
use App\Models\Payment;
use Carbon\Carbon;

class PlanService
{
    /**
     * Subscribe user to a plan
     *
     * @param User $user
     * @param Plan $plan
     * @param Carbon $startDate
     * @return Contract
     */
    public function subscribeToPlan(User $user, Plan $plan, Carbon $startDate)
    {
        // Deactivate any existing active contract
        $activeContract = $user->activeContract;
        if ($activeContract) {
            $activeContract->update(['active' => false]);
        }

        $contract = Contract::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'start_date' => $startDate,
            'end_date' => Carbon::now()->addMonth(),
            'active' => true,
        ]);

        Payment::create([
            'contract_id' => $contract->id,
            'amount' => $plan->price,
            'due_date' => $startDate,
            'paid' => false,
        ]);

        return $contract;
    }

    /**
     * Switch user's plan
     *
     * @param User $user
     * @param Plan $newPlan
     * @param Carbon $switchDate
     * @return Contract
     */
    public function switchPlan(User $user, Plan $newPlan, Carbon $switchDate)
    {
        $currentContract = $user->activeContract;

        if (!$currentContract) {
            throw new \Exception('No active contract found');
        }

        // Calculate credit from unused days in current plan
        $credit = $this->calculateCredit($currentContract, $switchDate);

        // Deactivate current contract
        $currentContract->update(['active' => false]);

        // Create new contract
        $newContract = Contract::create([
            'user_id' => $user->id,
            'plan_id' => $newPlan->id,
            'start_date' => $switchDate,
            'end_date' => Carbon::now()->addMonth(),
            'active' => true,
        ]);

        // Create payment for new contract with adjusted amount
        $adjustedAmount = max(0, $newPlan->price - $credit);
        Payment::create([
            'contract_id' => $newContract->id,
            'amount' => $adjustedAmount,
            'due_date' => $switchDate,
            'paid' => $adjustedAmount == 0, // If no amount is due, mark as paid
        ]);

        return $newContract;
    }

    /**
     * Calculate credit for unused days in current plan
     *
     * @param Contract $contract
     * @param Carbon $switchDate
     * @return float
     */
    private function calculateCredit(Contract $contract, Carbon $switchDate)
    {
        $plan = $contract->plan;
        $startDate = Carbon::parse($contract->start_date);

        // If switching on the same day as subscription, full credit
        if ($switchDate->isSameDay($startDate)) {
            return $plan->price;
        }

        // Calculate days in the month and used days
        $daysInMonth = $startDate->daysInMonth;
        $usedDays = $startDate->diffInDays($switchDate);

        // Calculate daily rate and unused days
        $dailyRate = $plan->price / $daysInMonth;
        $unusedDays = $daysInMonth - $usedDays;

        // Calculate credit
        $credit = $unusedDays * $dailyRate;

        return $credit;
    }
}
