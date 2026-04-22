package br.com.derich.mapper;

import br.com.derich.domain.Compra;
import br.com.derich.dto.CompraRequestDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompraMapper {

    Compra toEntity(CompraRequestDTO dto);
}
