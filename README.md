# Cloud Computing Project


## How to run
You need to run both Dockers, and then run the `run.bat` file.
Then enter the follwing URL: http://localhost:3000/

## Project structure
Our project contains 4 central microservices:
1. server
2. universe-simulator
3. kafaka-connector
4. dashboard

Two pricks:
1. Redis
2. Elastic Search

And Kafka is on the cloud

## A simple explanation of the project
- The server gathers for us all the data we know about Docker and provides a service to anyone who contacts it. It can be different types of events or in general the dashboard itself that requests information from.
- The information that comes from Redis goes through the univers-simulator where we create random data for each celestial body.
- All the data we created is stored in a Kafaka which is a kind of processing process of the data itself like a work queue.
- It receives information and informs those who need it about the newly entered information, the Kafaka is on the cloud.
- Through Kafka Connector we transfer the information that is in Kafka into the Elastic Search stored in Docker, where it stores all the information created.
- From there the dashboard requests all the information needed to present it. it can actively request the information from the server or alternatively receive it directly from the univers-simulator when the priority level is higher than 4.

Detailed instructions are in the projec's instructions file.