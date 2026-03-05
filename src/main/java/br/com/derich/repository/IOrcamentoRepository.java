package br.com.derich.repository;

import br.com.derich.domain.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IOrcamentoRepository extends JpaRepository<Orcamento, String> {
}
