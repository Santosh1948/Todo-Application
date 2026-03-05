# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy project files (project lives inside /todoapp)
COPY todoapp/pom.xml ./pom.xml
COPY todoapp/.mvn ./.mvn
COPY todoapp/mvnw ./mvnw
COPY todoapp/mvnw.cmd ./mvnw.cmd

RUN mvn -q -DskipTests dependency:go-offline

COPY todoapp/src ./src
RUN mvn -q -DskipTests package

# ---- Run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 10000
ENTRYPOINT ["java","-jar","/app/app.jar"]