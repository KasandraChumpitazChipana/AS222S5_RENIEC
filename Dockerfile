#Use official OpenJDK 17 image as base
FROM openjdk:17-jdk-alpine

#Set working directory
WORKDIR /app

#Copy the packaged jar file into our docker image
COPY target/ApiReniec-0.0.1-SNAPSHOT.jar app.jar

#Variables
ENV DATABASE_URL ${DATABASE_URL}
ENV DATABASE_USERNAME ${DATABASE_USERNAME}
ENV DATABASE_PASSWORD ${DATABASE_PASSWORD}

#Expose the port
EXPOSE 8080

#Specify the command to run on container start
CMD ["java", "-jar", "app.jar"]