<?php

namespace App\Enums;

enum ContactStage: string
{
    case Novo = 'novo';
    case Contato = 'contato';
    case Qualificado = 'qualificado';
    case Proposta = 'proposta';
    case Ganho = 'ganho';
    case Perdido = 'perdido';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
