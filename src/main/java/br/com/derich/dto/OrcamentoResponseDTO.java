package br.com.derich.dto;

import br.com.derich.domain.Compra;

import java.math.BigDecimal;
import java.util.List;

public record OrcamentoResponseDTO(
        String id,
        List<Compra> compras,
        String mes,
        BigDecimal salario,
        BigDecimal totalGasto,
        BigDecimal saldoDisponivel,
        BigDecimal gastoRecorrente,
        BigDecimal cartaoCredito
) {}
