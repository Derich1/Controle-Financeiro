package br.com.derich.dto;

import br.com.derich.domain.Orcamento;

import java.math.BigDecimal;

public record CompraDTO(
        Orcamento orcamento,
        BigDecimal valor,
        String nomeProduto,
        String tipo,
        String descricao,
        String fatura
) {}
