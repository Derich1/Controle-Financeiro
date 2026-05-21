package br.com.derich.service;

import br.com.derich.domain.Compra;
import br.com.derich.dto.CompraDTO;
import br.com.derich.mapper.CompraMapper;
import br.com.derich.repository.ICompraRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static br.com.derich.util.MergeUtils.mergeIfDifferent;

@Service
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

    public CompraDTO alterarCompra(Long id, CompraDTO dto){
        Compra compraBanco = compraRepository.findById(id)
                .orElseThrow();
        boolean houveMudanca = mergeIfDifferent(dto, compraBanco);
        if (houveMudanca){
            compraBanco = compraRepository.save(compraBanco);
        }
        return compraMapper.toDTO(compraBanco);
    }
}
