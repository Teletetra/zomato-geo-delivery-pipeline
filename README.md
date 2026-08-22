# Zomato Backend — NestJS Microservices

Architecture: Microservices + DDD + Hexagonal/Ports & Adapters + CQRS + Event-Driven + selective Event Sourcing.

## Services
- api-gateway
- auth-service
- user-service
- restaurant-service
- menu-service
- order-service
- payment-service
- delivery-service
- notification-service

## Local infrastructure
`docker compose up -d`

## Install
`pnpm install`

## Development
`pnpm --filter order-service start:dev`

The current repository is an architectural scaffold. Order and Auth contain representative CQRS/domain/event flows; remaining services have the same bounded-context boundaries ready to implement.
