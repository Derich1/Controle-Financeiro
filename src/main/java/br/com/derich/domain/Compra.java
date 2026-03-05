package br.com.derich.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "compra")
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private String id;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private String nomeProduto;

    @Column(nullable = false)
    private String tipo;

    // Por padrão é nullable = true então não precisa escrever
    private String descricao;

    // Hibernate cria automaticamente no momento da criação de cada documento
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime data;

    // Mês/ano de vencimento da fatura à qual esta compra está vinculada
    @Column(nullable = false)
    private String fatura;
}
