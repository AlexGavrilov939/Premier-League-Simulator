<?php

namespace App\Providers\Passwords;

use App\Models\TeamModel;
use Illuminate\Auth\Passwords\DatabaseTokenRepository;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Support\Carbon;

class CPDatabaseTokenRepository extends DatabaseTokenRepository
{
    /**
     * Build the record payload for the table.
     *
     * @param  string  $email
     * @param  string  $token
     * @return array
     */
    protected function getPayload($email, $token): array
    {
        return ['email' => $email, 'token' => $this->hasher->make($token), TeamModel::CREATED_AT => new Carbon];
    }

    /**
     * Determine if a token record exists and is valid.
     *
     * @param  CanResetPassword  $user
     * @param  string  $token
     * @return bool
     */
    public function exists(CanResetPasswordContract $user, $token): bool
    {
        $record = (array) $this->getTable()->where(
            'email', $user->getEmailForPasswordReset()
        )->first();

        return $record &&
            ! $this->tokenExpired($record[TeamModel::CREATED_AT]) &&
            $this->hasher->check($token, $record['token']);
    }

    /**
     * Determine if the given user recently created a password reset token.
     *
     * @param  CanResetPassword  $user
     * @return bool
     */
    public function recentlyCreatedToken(CanResetPasswordContract $user): bool
    {
        $record = (array) $this->getTable()->where(
            'email', $user->getEmailForPasswordReset()
        )->first();

        return $record && $this->tokenRecentlyCreated($record[TeamModel::CREATED_AT]);
    }

    /**
     * Delete expired tokens.
     *
     * @return void
     */
    public function deleteExpired()
    {
        $expiredAt = Carbon::now()->subSeconds($this->expires);
        $this->getTable()->where(TeamModel::CREATED_AT, '<', $expiredAt)->delete();
    }
}
