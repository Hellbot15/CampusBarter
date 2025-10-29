## Multi-stage Dockerfile for building and running the CampusBarter Spring Boot app

FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom and sources and build
COPY pom.xml ./
COPY src ./src

RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
