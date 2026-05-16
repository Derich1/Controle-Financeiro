# ── Build stage ──────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copia o wrapper do Maven e o pom.xml para cache das dependências
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Baixa as dependências (camada cacheada enquanto o pom.xml não mudar)
RUN ./mvnw dependency:go-offline -q

# Copia o código-fonte e faz o build
COPY src ./src
RUN ./mvnw package -DskipTests -q

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Usuário não-root por segurança
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
