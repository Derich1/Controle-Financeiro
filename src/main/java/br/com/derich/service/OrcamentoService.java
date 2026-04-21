package br.com.derich.service;

import br.com.derich.mapper.OrcamentoMapper;
import br.com.derich.domain.Compra;
import br.com.derich.domain.Orcamento;
import br.com.derich.dto.OrcamentoRequestDTO;
import br.com.derich.repository.IOrcamentoRepository;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.OffsetDateTime;

@Service
public class OrcamentoService {

    private IOrcamentoRepository orcamentoRepository;
    private final OrcamentoMapper orcamentoMapper;

    public OrcamentoService(OrcamentoMapper orcamentoMapper) {
        this.orcamentoMapper = orcamentoMapper;
    }

    public Orcamento salvarOrcamento(OrcamentoRequestDTO orcamentoDTO){
        Orcamento orcamento = orcamentoMapper.toEntity(orcamentoDTO);
        return orcamentoRepository.save(orcamento);
    }

    public Orcamento editarOrcamento(String id, Orcamento orcamento){
        Orcamento orcamentoBancoDados = orcamentoRepository.findById(id)
                .orElseThrow();
        orcamentoBancoDados.setSalario(orcamento.getSalario());
        orcamentoBancoDados.setTotalGasto(orcamento.getTotalGasto());
        return orcamentoRepository.save(orcamentoBancoDados);
    }

    public Orcamento adicionarCompraNaListaCompras(String id, Compra compra){
        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow();
        orcamento.adicionarCompra(compra);
        return orcamentoRepository.save(orcamento);
    }

    public Orcamento mostrarOrcamentoMesEspecifico(Month mes){
        return orcamentoRepository.findByMonth(mes).orElseThrow();
    }

    public Orcamento mostrarOrcamentoMesAtual(){
        OffsetDateTime offsetDate = OffsetDateTime.now();
        return orcamentoRepository.findByMonth(offsetDate.getMonth()).orElseThrow();
    }
}
