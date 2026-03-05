package br.com.derich.controller;

import br.com.derich.domain.Compra;
import br.com.derich.service.CompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/compras")
@RequiredArgsConstructor
public class CompraController {

    private CompraService compraService;

    @PostMapping
    public ResponseEntity<Compra> salvarCompra(@RequestBody Compra compra){
        Compra compraSalva = compraService.salvarCompra(compra);
        return ResponseEntity.status(HttpStatus.CREATED).body(compraSalva);
    }

    @GetMapping
    public ResponseEntity<List<Compra>> listarCompras(){
        return ResponseEntity.ok(compraService.listarCompras());
    }
}
