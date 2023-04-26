# Spring Boot Application with OpenAPI, Swagger UI, and Docker

This is a Spring Boot application that uses OpenAPI 3.0 specifications to generate API classes, provides API documentation using Swagger UI, and can be containerized using Docker for easy deployment and distribution.

## Table of Contents

-   [Getting Started](#getting-started)
-   [OpenAPI and Code Generation](#openapi-and-code-generation)
-   [API Documentation with Swagger UI](#api-documentation-with-swagger-ui)
-   [Docker Integration](#docker-integration)
-   [Running the Application with Docker](#running-the-application-with-docker)

## Getting Started

To run the server, follow these steps:

1.  Ensure you have **JDK 11** or higher installed on your system.
2.  Make sure **Maven** is installed on your system.
3.  Clone the repository and navigate to the project folder.
4.  Run the following command to build and start the server:
      ```
      mvn spring-boot:run
      ```
    The server will be running on `http://localhost:8080`.

## OpenAPI and Code Generation

This application uses an `openapi.yaml` file to define the API specifications. The file is located in the `src/main/resources` folder. To automatically generate classes based on these specifications, the **OpenAPI Generator Maven Plugin** is used.

To generate the classes, follow these steps:

1.  Open the `pom.xml` file in the project folder.
2.  Locate the `openapi-generator-maven-plugin` section.
3.  Verify that the input specification is set to the correct `openapi.yaml` file.
4.  Run the following command:
      ```
      mvn clean compile
      ```

## API Documentation with Swagger UI

This application uses **Swagger UI** to provide interactive API documentation. The documentation can be accessed at the following URL when the server is running:

```
http://localhost:8080/swagger-ui.html
```

## Docker Integration

To containerize the application using Docker, follow these steps:

1.  Ensure **Docker** is installed on your system.
2.  In the project folder, create a `Dockerfile` with the following contents:

Dockerfile
```
FROM openjdk:11-jdk
VOLUME /tmp
EXPOSE 8080
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
```
3.  Build the Docker image by running the following command:
```
docker build -t springboot-app .
```
This will create a Docker image named `springboot-app`.

## Running the Application with Docker

To run the application using the Docker image, execute the following command:
```
docker run -p 8080:8080 springboot-app
```
The application will be accessible at `http://localhost:8080`.

----------

_This README.md file covers the essential aspects of the Spring Boot application, including running the server, OpenAPI code generation, Swagger UI for API documentation, and Docker integration._