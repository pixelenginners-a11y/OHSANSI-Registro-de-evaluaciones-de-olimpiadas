<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use \Illuminate\Database\Eloquent\Collection;
use App\Services\UserService;
use App\Services\EvaluatorAreaService;

class EvaluatorService
{
    public function __construct(
        protected UserService $userService,
        protected EvaluatorAreaService $evaluatorAreaService
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
            $this->evaluatorAreaService->assign($user->id, $data['area_id']);
            return $user;
        });
    }

    public function updateEvaluator(int $userId, array $data): ?User
    {
        return DB::transaction(function () use ($userId, $data) {
            $role = $this->userService->getUserRole($userId);
            if (!$role || $role->name !== 'Evaluador') {
                throw ValidationException::withMessages([
                    'role' => ['El usuario no es un evaluador.']
                ]);
            }
            $user = $this->userService->updateUser($userId, $data);
            if (isset($data['area_id'])) {
                $this->evaluatorAreaService->updateArea($userId, $data['area_id']);
            }
            return $user;
        });
    }

    public function deleteEvaluator(int $userId): bool
    {
        return DB::transaction(function () use ($userId) {
            $role = $this->userService->getUserRole($userId);
            if ($role && $role->name !== 'Evaluador') {
                throw ValidationException::withMessages([
                    'role' => ['El usuario no es un evaluador.']
                ]);
            }
            $this->evaluatorAreaService->remove($userId);
            return $this->userService->deleteUser($userId);
        });
    }

    public function getEvaluatorById(int $userId): ?User
    {
        return $this->userService->findUserWithRole($userId, 'Evaluador');
    }

    public function getEvaluators(): Collection
    {
        return User::select(
            'users.id', 
            'users.full_name', 
            'users.username', 
            'users.email',  
            'users.phone', 
            'users.active',
            'areas.name as area'
          )
          ->join('roles','users.role_id','=','roles.id')
          ->leftJoin('evaluator_areas as ea','users.id','=','ea.user_id')
          ->leftJoin('areas','areas.id','=','ea.area_id')
          ->where('roles.name', 'Evaluador')
          ->orderBy('users.id', 'desc')
          ->get();
    }
}