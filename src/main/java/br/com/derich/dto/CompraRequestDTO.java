package br.com.derich.dto;

import br.com.derich.domain.Orcamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CompraRequestDTO(
        Orcamento orcamento,
        BigDecimal valor,
        String nomeProduto,
        String tipo,
        String descricao,
        LocalDateTime data,
        String fatura
) {}
