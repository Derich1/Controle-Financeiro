package br.com.derich.util;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.Objects;

public class MergeUtils {

    public static boolean mergeIfDifferent(Object source, Object target) {

        // Obtém o "espelho" da classe do objeto source em tempo de execução
        Class<?> clazz = source.getClass();

        boolean houveMudanca = false;

        // Percorre a hierarquia de classes até chegar em Object (classe raiz do Java)
        // necessário para capturar campos herdados de superclasses (ex: BaseEntity)
        while (clazz != null && clazz != Object.class) {

            // Retorna todos os campos declarados na classe atual, incluindo os privados
            for (Field field : clazz.getDeclaredFields()) {

                // Campos estáticos pertencem à classe, não ao objeto — ignora e vai pro próximo
                if (Modifier.isStatic(field.getModifiers())) continue;

                // Remove a restrição de acesso do campo (necessário para campos private)
                field.setAccessible(true);

                try {
                    // Lê o valor do campo no objeto source (veio da requisição)
                    Object valorSource = field.get(source);

                    // Lê o valor do mesmo campo no objeto target (veio do banco)
                    Object valorTarget = field.get(target);

                    // Compara os dois valores — usa Objects.equals para tratar null sem NPE
                    // e comparar o conteúdo dos objetos ao invés da referência de memória
                    if (!Objects.equals(valorSource, valorTarget)) {

                        // Valores diferentes: sobrescreve o campo do banco com o valor do campo da requisição
                        field.set(target, valorSource);

                        // Marca que houve ao menos uma mudança
                        houveMudanca = true;
                    }
                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Erro no campo: " + field.getName(), e);
                }
            }

            // Sobe um nível na hierarquia para processar os campos da superclasse
            clazz = clazz.getSuperclass();
        }
        return houveMudanca;
    }
}