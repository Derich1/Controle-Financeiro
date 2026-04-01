package br.com.derich.util;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.Objects;

public class MergeUtils {

    public static boolean mergeIfDifferent(Object source, Object target) {
        Class<?> clazz = source.getClass();
        boolean houveMudanca = false;

        while (clazz != null && clazz != Object.class) {
            for (Field field : clazz.getDeclaredFields()) {

                if (Modifier.isStatic(field.getModifiers())) continue;

                field.setAccessible(true);
                try {
                    Object valorSource = field.get(source);
                    Object valorTarget = field.get(target);

                    if (!Objects.equals(valorSource, valorTarget)) {
                        field.set(target, valorSource);
                        houveMudanca = true;
                    }

                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Erro no campo: " + field.getName(), e);
                }
            }
            clazz = clazz.getSuperclass();
        }

        return houveMudanca;
    }
}