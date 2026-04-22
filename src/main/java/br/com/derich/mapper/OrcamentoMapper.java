package br.com.derich.mapper;

import br.com.derich.domain.Orcamento;
import br.com.derich.dto.OrcamentoRequestDTO;
import br.com.derich.dto.OrcamentoResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrcamentoMapper {

    Orcamento toEntity(OrcamentoRequestDTO dto);
    OrcamentoResponseDTO toResponse(Orcamento dto);
}