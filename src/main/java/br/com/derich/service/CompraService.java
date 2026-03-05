package br.com.derich.service;

import br.com.derich.domain.Compra;
import br.com.derich.repository.ICompraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompraService {

    public static ICompraRepository compraRepository;

    public Compra salvarCompra(Compra compra) {
        return compraRepository.save(compra);
    }

    public List<Compra> listarCompras(){
        return compraRepository.findAll();
    }
}
