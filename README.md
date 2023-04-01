

# SetelAssessment

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Extensible Build Framework**

check the dependencies using nx dep-graph  

## Pre-requisites
### Localhost
[Node](https://nodejs.org/en/)
[Nx](https://nx.dev)
### Deployment
[Docker](https://www.docker.com/)
[Terraform](https://www.terraform.io/)
[Kubernetes](https://kubernetes.io/)

## Localhost
yarn  
docker compose up -f docker-compose/deps.yml  
nx serve orders-microservice  
nx serve payment-microservice  
nx serve orders-operations-portal  

## Deployment
terraform init ./terraform  
terraform apply  
kubectl apply -f ./kubernetes  

## Core Dependencies
### orders-microservice
rxjs
Fastify
Axios
Kafka
Redis
MongoDB
### orders-operations-portal
React
Bulma
React-redux
rxjs
### payment-microservice
Nest.js
Express
Kafka
MongoDB

## Test
Unit and Integration tests uses Jest and e2e test uses cypress  

nx test orders-microservice  
nx test orders-operations-portal  
nx test payment-microservice  

nx e2e orders-operations-portal  
