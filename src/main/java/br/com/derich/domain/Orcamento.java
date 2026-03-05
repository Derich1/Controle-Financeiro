package br.com.derich.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "orcamento")
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private UUID id;

    private List<Compra> compras;

    @Column(nullable = false)
    private BigDecimal totalMes;

    @Column(nullable = false)
    private BigDecimal salario;

    // Valor do salário - totalMes
    @Column(nullable = false)
    private BigDecimal saldoMes;


}
