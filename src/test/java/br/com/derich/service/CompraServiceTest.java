package br.com.derich.service;

import br.com.derich.CompraTestFactory;
import br.com.derich.domain.Compra;
import br.com.derich.domain.Orcamento;
import br.com.derich.dto.CompraDTO;
import br.com.derich.mapper.CompraMapper;
import br.com.derich.repository.ICompraRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CompraServiceTest {

    @Mock
    private ICompraRepository compraRepository;

    @InjectMocks
    private CompraService compraService;

    @Mock
    private CompraMapper compraMapper;

    @Test
    public void salvarCompra(){

        CompraDTO compraDTO = CompraTestFactory.criarCompraDTO();

        Compra compra = CompraTestFactory.criarCompra();

        /*
        Mock não tem comportamento então tem que chamar falando
        o que ele deve retornar no thenReturn
         */
        when(compraMapper.toEntity(compraDTO)).thenReturn(compra);

        when(compraRepository.save(compra)).thenReturn(compra);

        when(compraMapper.toDTO(compra)).thenReturn(compraDTO);

        CompraDTO dto = compraService.salvarCompra(compraDTO);

        assertEquals(compraDTO, dto);

        // verifica se aquele metodo realmente foi chamado
        verify(compraMapper).toEntity(compraDTO);

        verify(compraRepository).save(compra);

        verify(compraMapper).toDTO(compra);
    }
}
