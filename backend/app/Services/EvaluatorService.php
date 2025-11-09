<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use \Illuminate\Database\Eloquent\Collection;
use App\Services\UserService;
use App\Services\EvaluatorGradeService;
use Illuminate\Pagination\LengthAwarePaginator;

class EvaluatorService
{
    public function __construct(
        protected UserService $userService,
        protected EvaluatorGradeService $evaluatorGradeService
    )
    {}

    public function createEvaluator(array $data): User
    {
        return DB::transaction(function () use ($data){
            $user = $this->userService->createUser([
                'full_name' => $data['full_name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => $data['password'],
                'role_id' => 2,
            ]);
            $this->evaluatorGradeService->assign($user->id, $data['grades']);
            return $user;
        });
    }

    public function updateEvaluator(int $userId, array $data): ?User
    {
        return DB::transaction(function () use ($userId, $data) {
            $this->userService->ensureUserHasRole($userId, 'Evaluador');
            $user = $this->userService->updateUser($userId, $data);
            if (isset($data['grades'])) {
                $this->evaluatorGradeService->updateGrades($userId, $data['grades']);
            }
            return $user;
        });
    }

    public function deleteEvaluator(int $userId): bool
    {
        return DB::transaction(function () use ($userId) {
            $this->userService->ensureUserHasRole($userId, 'Evaluador');
            $this->evaluatorGradeService->remove($userId);
            return $this->userService->deleteUser($userId);
        });
    }

    public function getEvaluatorById(int $userId): ?User
    {
        return $this->userService->findUserWithRole($userId, 'Evaluador');
    }

    public function getAll(): LengthAwarePaginator
    {
        return User::select(
            'users.id', 
            'users.full_name', 
            'users.username', 
            'users.email',  
            'users.phone', 
            'users.active',
            DB::raw('JSON_AGG(DISTINCT grades.id) as grade_ids'),
            DB::raw('JSON_AGG(DISTINCT grades.name) as grade_names')
          )
          ->join('roles','users.role_id','=','roles.id')
          ->leftJoin('evaluator_grades as eg','users.id','=','eg.evaluator_id')
          ->leftJoin('grades','grades.id','=','eg.grade_id')
          ->where('roles.name', 'Evaluador')
          ->groupBy('users.id', 'users.full_name', 'users.username', 'users.email', 'users.phone', 'users.active')
          ->orderBy('users.id', 'desc')
          ->paginate(10);
    }

    public function searchEvaluators(string $search, ?string $gradeId = null, int $perPage = 10): LengthAwarePaginator
    {
        $searchLower = strtolower($search);
        
        $query = User::select(
                'users.id',
                'users.full_name',
                'users.username',
                'users.email',
                'users.phone',
                'users.active',
                DB::raw('JSON_AGG(DISTINCT grades.id) as grade_ids'),
                DB::raw('JSON_AGG(DISTINCT grades.name) as grade_names')
            )
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->leftJoin('evaluator_grades as eg', 'users.id', '=', 'eg.evaluator_id')
            ->leftJoin('grades', 'grades.id', '=', 'eg.grade_id')
            ->where('roles.name', 'Evaluador')
            ->groupBy('users.id', 'users.full_name', 'users.username', 'users.email', 'users.phone', 'users.active');
        
        if (!empty($gradeId)) {
            $query->whereExists(function ($existsQuery) use ($gradeId) {
            $existsQuery->select(DB::raw(1))
                       ->from('evaluator_grades')
                       ->whereColumn('evaluator_grades.evaluator_id', 'users.id')
                       ->where('evaluator_grades.grade_id', $gradeId);
            });
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($searchLower) {
                $q->whereRaw('LOWER(users.full_name) like ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(users.username) like ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(users.email) like ?', ["%{$searchLower}%"]);
            });
        }
        
        return $query->orderBy('users.id', 'desc')
                    ->paginate($perPage);
    }
}