package br.com.derich.controller;

import br.com.derich.domain.Orcamento;
import br.com.derich.dto.OrcamentoRequestDTO;
import br.com.derich.dto.OrcamentoResponseDTO;
import br.com.derich.service.OrcamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
