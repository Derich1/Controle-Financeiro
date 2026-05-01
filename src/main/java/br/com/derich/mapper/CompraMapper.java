package br.com.derich.mapper;

import br.com.derich.domain.Compra;
import br.com.derich.dto.CompraDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CompraMapper {

    Compra toEntity(CompraDTO dto);
    CompraDTO toDTO(Compra compra);
    List<CompraDTO> toDTOList(List<Compra> compras);
}
