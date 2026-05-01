package br.com.derich.controller;

import br.com.derich.dto.CompraDTO;
import br.com.derich.mapper.CompraMapper;
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
    private final CompraMapper compraMapper;

    @PostMapping
    public ResponseEntity<CompraDTO> salvarCompra(@RequestBody CompraDTO dto){
        CompraDTO compraSalva = compraService.salvarCompra(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(compraSalva);
    }

    @GetMapping
    public ResponseEntity<List<CompraDTO>> listarCompras(){
        List<CompraDTO> comprasDTO = compraMapper.toDTOList(compraService.listarCompras());
        return ResponseEntity.ok(comprasDTO);
    }
}
