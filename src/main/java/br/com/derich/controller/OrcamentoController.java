package br.com.derich.controller;

import br.com.derich.domain.Orcamento;
import br.com.derich.service.OrcamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orcamento")
public class OrcamentoController {

    private OrcamentoService orcamentoService;

    public ResponseEntity<Orcamento> salvarOrcamento(Orcamento orcamento){
        Orcamento orcamentoSalvo = orcamentoService.salvarOrcamento(orcamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(orcamentoSalvo);
    }
}
