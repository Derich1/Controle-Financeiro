package br.com.derich.service;

import br.com.derich.domain.Compra;
import br.com.derich.repository.ICompraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static br.com.derich.util.MergeUtils.mergeIfDifferent;

@Service
@RequiredArgsConstructor
public class CompraService {

    public ICompraRepository compraRepository;

    public CompraService(ICompraRepository compraRepository){
        this.compraRepository = compraRepository;
    }

    public Compra salvarCompra(Compra compra) {
        return compraRepository.save(compra);
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
