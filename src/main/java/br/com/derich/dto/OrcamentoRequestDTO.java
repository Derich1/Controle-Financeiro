package br.com.derich.dto;

import java.math.BigDecimal;

public record OrcamentoRequestDTO(
        String mes,
        BigDecimal salario,
        BigDecimal gastoRecorrente,
        BigDecimal cartaoCredito
)
{}
