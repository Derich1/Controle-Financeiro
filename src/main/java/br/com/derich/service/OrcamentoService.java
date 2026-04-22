package br.com.derich.service;

import br.com.derich.dto.OrcamentoResponseDTO;
import br.com.derich.mapper.OrcamentoMapper;
import br.com.derich.domain.Compra;
import br.com.derich.domain.Orcamento;
import br.com.derich.dto.OrcamentoRequestDTO;
import br.com.derich.repository.IOrcamentoRepository;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class OrcamentoService {

    private IOrcamentoRepository orcamentoRepository;
    private final OrcamentoMapper orcamentoMapper;

    public OrcamentoService(OrcamentoMapper orcamentoMapper) {
        this.orcamentoMapper = orcamentoMapper;
    }

    public OrcamentoResponseDTO salvarOrcamento(OrcamentoRequestDTO orcamentoDTO){
        Orcamento orcamento = orcamentoMapper.toEntity(orcamentoDTO);
        Orcamento orcamentoSalvo = orcamentoRepository.save(orcamento);
        return orcamentoMapper.toResponse(orcamentoSalvo);
    }

    /*
    Utilizando Optional é mais seguro que utilizar entidade diretamente, pois te obriga
    a tratar os casos de sucesso e de falha na busca em tempo de compilação

    O map precisa de menos linhas para tratar o Optional
     */
    public Optional<OrcamentoResponseDTO> editarOrcamento(String id, OrcamentoRequestDTO dto){
        return orcamentoRepository.findById(id)
                // caso não encontrado no banco de dados ele ignora o map e retorna um Optional.empty()
                .map(existente -> {
                    existente.setSalario(dto.salario());
                    Orcamento orcamentoSalvo = orcamentoRepository.save(existente);
                    return orcamentoMapper.toResponse(orcamentoSalvo);
                });
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
