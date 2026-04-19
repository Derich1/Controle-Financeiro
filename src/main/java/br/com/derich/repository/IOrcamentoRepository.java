package br.com.derich.repository;

import br.com.derich.domain.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Month;
import java.util.Optional;

public interface IOrcamentoRepository extends JpaRepository<Orcamento, String> {

    Optional<Orcamento> findByMonth(Month mes);
}
