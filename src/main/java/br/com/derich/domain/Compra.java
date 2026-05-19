package br.com.derich.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@Entity
@Table(name = "compra")
@NoArgsConstructor
@AllArgsConstructor
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "orcamento_id")
    private Orcamento orcamento;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private String nomeProduto;

    @Column(nullable = false)
    private String tipo;

    // Por padrão é nullable = true então não precisa escrever
    private String descricao;

    @Column(nullable = false, updatable = false)
    private LocalDate data;

    // Mês/ano de vencimento da fatura à qual esta compra está vinculada
    @Column(nullable = false)
    private String fatura;

    @PrePersist
    public void prePersist() {
        this.data = LocalDate.now();
    }
}
