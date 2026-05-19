package br.com.derich;

import br.com.derich.domain.Compra;
import br.com.derich.domain.Orcamento;
import br.com.derich.dto.CompraDTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CompraTestFactory {

    public static Compra criarCompra() {
        return Compra.builder()
                .id(1L)
                .valor(new BigDecimal("120.50"))
                .nomeProduto("Mouse Gamer")
                .tipo("Eletrônico")
                .descricao("Mouse RGB")
                .data(LocalDate.now())
                .orcamento(
                        Orcamento.builder()
                                .id("orc-001")
                                .build()
                )
                .build();
    }

    public static CompraDTO criarCompraDTO() {
        return new CompraDTO(
                "orc-001",
                new BigDecimal("120.50"),
                "Mouse Gamer",
                "Eletrônico",
                "Mouse RGB",
                LocalDate.now()
        );
    }
}
