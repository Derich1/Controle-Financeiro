package br.com.derich.controller;

import br.com.derich.dto.CompraDTO;
import br.com.derich.dto.OrcamentoRequestDTO;
import br.com.derich.dto.OrcamentoResponseDTO;
import br.com.derich.service.OrcamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Month;

@RestController
@RequestMapping("/api/v1/orcamento")
public class OrcamentoController {

    private OrcamentoService orcamentoService;

    public OrcamentoController(OrcamentoService orcamentoService){
        this.orcamentoService = orcamentoService;
    }

    @PostMapping
    public ResponseEntity<OrcamentoResponseDTO> salvarOrcamento(@RequestBody @Valid OrcamentoRequestDTO orcamento){
        OrcamentoResponseDTO orcamentoSalvo = orcamentoService.salvarOrcamento(orcamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(orcamentoSalvo);
    }

    // Optional obriga a tratar caso de falha em tempo de compilação
    @PutMapping("/{id}")
    public ResponseEntity<OrcamentoResponseDTO> editarOrcamento(@PathVariable String id, @RequestBody @Valid OrcamentoRequestDTO dto){
        return orcamentoService.editarOrcamento(id, dto)
                // Se o Optional tiver valor  → transforma OrcamentoResponseDTO em ResponseEntity 200
                // Se o Optional estiver vazio → não faz nada, propaga o vazio
                .map(ResponseEntity::ok)

                // Se o Optional tiver valor  → retorna o valor que estava dentro
                // Se o Optional estiver vazio → retorna o 404 que você definiu
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/adicionarCompra")
    public ResponseEntity<OrcamentoResponseDTO> adicionarCompraNaLista(CompraDTO compraDTO){
        return orcamentoService.adicionarCompraNaListaCompras(compraDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/mes/{mes}")
    public ResponseEntity<OrcamentoResponseDTO> mostrarOrcamentoMesEspecifico(@PathVariable Month mes){
        return orcamentoService.mostrarOrcamentoMesEspecifico(mes)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/mes/atual")
    public ResponseEntity<OrcamentoResponseDTO> mostrarOrcamentoMesAtual(){
        return orcamentoService.mostrarOrcamentoMesAtual()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
