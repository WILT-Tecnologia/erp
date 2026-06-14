<?php

namespace App\Enums;

enum AdminStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';

    public static function enum(): array
    {
        return array_column(self::cases(), 'value');
    }
}
