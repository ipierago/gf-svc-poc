# gf-svc-poc

GuildFi Microservices Proof of Concept

## Setup

## Build

Build protos first. This copies generated files into the other projects.

## TODO

- aborting timed out pending commits
- remove updatedAt and optimistic locking

- kafka/rabbitmq
- use events for commit/abort
- k8s

- send buy item message

- load balance api route
- long running business logic
- gxp
  - convert gxp to golang
  - in-memory cache
    - initialize with pending operations and recently updated transactions
    - heartbeat saves
  - backed by db
- inbox
  - subscribe message in backend and send receipt to inbox
  - inbox entity
  - get inbox rest api and frontend
- activity feed
  - microservice
  - subscribe buy item message and record activity
  - storage - document database?
  - get activity feed rest api and frontend
