package br.com.derich.dto;

import br.com.derich.domain.Orcamento;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CompraDTO(
        String orcamentoId,
        BigDecimal valor,
        String nomeProduto,
        String tipo,
        String descricao,
        LocalDate fatura
) {}
