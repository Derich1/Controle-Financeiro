package br.com.derich.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/*
O lombok só cria automaticamente os getters e setters caso eles não existam no código
por isso o getSaldoDisponivel pode ser declarado sem gerar conflitos com a anotação
 */
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

    private BigDecimal totalGasto;

    private BigDecimal saldoDisponivel;

    public BigDecimal getTotalGasto(){
        return this.getCompras().stream()
                .map(Compra::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * O saldo disponível deve ser calculado a partir dos campos salário e totalGasto
     * por conta disso é melhor que ele seja calculado no momento que é chamado
     * ao invés de ficar salvando no banco de dados sempre que algum desses outros campos for alterado
     */
    public BigDecimal getSaldoDisponivel() {
        return salario.subtract(totalGasto);
    }

    /*
        Orientado a domínio = objeto controla o seu próprio comportamento

        Não é possível quebrar as regras para adicionar uma compra
        Lógica centralizada

        | Tipo de lógica          | Vai onde? | Exemplo          |
        | ----------------------- | --------- | ---------------- |
        | Validação de compra     | Entidade  | valor > 0        |
        | Cálculo de saldo        | Entidade  | salario - gastos |
        | Adicionar item na lista | Entidade  | compras.add      |
        | Buscar no banco         | Service   | findById         |
        | Salvar dados            | Service   | save             |
        | Fluxo entre objetos     | Service   | transferir       |
        | Integração externa      | Service   | API, fila, etc   |

        Essa regra precisa de algo fora do objeto?
        Não → Entidade
        Sim → Service
     */
    public void adicionarCompra(Compra compra){
        this.getCompras().add(compra);
    }
}
