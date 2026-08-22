# Restaurant Service

DDD + Hexagonal + CQRS NestJS service. REST endpoints are exposed under `/restaurants`. Domain events are published to Kafka topics `restaurant.created`, `restaurant.updated`, and `restaurant.status.changed`.
