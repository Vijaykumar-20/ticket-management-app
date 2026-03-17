# Stage 1: Build Angular Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build -- --configuration production

# Stage 2: Build Spring Boot Backend
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY backend/pom.xml ./backend/
# Copy the built frontend to backend static resources
COPY --from=frontend-build /app/frontend/dist/frontend/browser /app/backend/src/main/resources/static
COPY backend/src ./backend/src
RUN mvn -f backend/pom.xml clean package -DskipTests

# Stage 3: Production Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
