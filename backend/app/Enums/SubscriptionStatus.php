<?php

namespace App\Enums;

enum SubscriptionStatus: string
{
    case Active = 'active';
    case Canceled = 'canceled';
    case PastDue = 'past_due';
    case Trialing = 'trialing';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
