package br.com.derich.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "orcamento")
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private String id;

    private List<Compra> compras;

    @Column(nullable = false)
    private String mes;

    @Column(nullable = false)
    private BigDecimal salario;

    @Column(nullable = false)
    private BigDecimal totalGasto;

    @Column(nullable = false)
    private BigDecimal saldoDisponivel;
}
