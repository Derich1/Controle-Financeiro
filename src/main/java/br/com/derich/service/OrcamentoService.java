package br.com.derich.service;

import br.com.derich.domain.Orcamento;
import br.com.derich.repository.IOrcamentoRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrcamentoService {

    private IOrcamentoRepository orcamentoRepository;

    public Orcamento salvarOrcamento(Orcamento orcamento){
        return orcamentoRepository.save(orcamento);
    }

//    public Orcamento editarOrcamento(Orcamento orcamento){
//        orcamento = orcamentoRepository.findById(orcamento.getId())
//                .orElseThrow();
//    }
}
