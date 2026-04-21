package br.com.derich.mapper;

import br.com.derich.domain.Orcamento;
import br.com.derich.dto.OrcamentoRequestDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrcamentoMapper {

    Orcamento toEntity(OrcamentoRequestDTO dto);
}