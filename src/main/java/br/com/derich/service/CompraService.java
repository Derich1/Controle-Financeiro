package br.com.derich.service;

import br.com.derich.domain.Compra;
import br.com.derich.dto.CompraDTO;
import br.com.derich.mapper.CompraMapper;
import br.com.derich.repository.ICompraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static br.com.derich.util.MergeUtils.mergeIfDifferent;

@Service
@RequiredArgsConstructor
public class CompraService {

    public ICompraRepository compraRepository;
    public CompraMapper compraMapper;

    public CompraService(ICompraRepository compraRepository, CompraMapper compraMapper){
        this.compraRepository = compraRepository;
        this.compraMapper = compraMapper;
    }

    public CompraDTO salvarCompra(CompraDTO dto) {
        Compra compra = compraMapper.toEntity(dto);
        Compra compraSalva = compraRepository.save(compra);
        return compraMapper.toDTO(compraSalva);
    }

    public List<Compra> listarCompras(){
        return compraRepository.findAll();
    }

    public Compra alterarCompra(Compra compra){
        Compra compraBanco = compraRepository.findById(compra.getId())
                .orElseThrow();
        boolean houveMudanca = mergeIfDifferent(compra, compraBanco);
        if (houveMudanca){
            return compraRepository.save(compraBanco);
        }
        return compraBanco;
    }
}
