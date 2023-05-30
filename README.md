# gf-svc-poc

GuildFi Microservices Proof of Concept

## Setup

## Build

Build protos and shared first. This copies generated files into the other projects.

```bash
cd protos
npm run build
cd ../shared
npm run build
```

## Test Sequence

The following is a good test sequence:

```bash
cd cli
npm run dev -- ls
npm run dev -- get-all
npm run dev -- create-user my-name
npm run dev -- create-item my-item 10
npm run dev -- create-marketplace-item 1 12
npm run dev -- user-gxp-add 1 100
npm run dev -- buy-marketplace-item 1 1
npm run dev -- ls
npm run dev -- get-all
```

There are no volumes defined, but if you do not rm the container, the contents of the database persist between runs.

## TODO

- aborting timed out pending commits
- remove updatedAt and optimistic locking

- do something with BuyItemEvent

  - in backend
  - in another service (feed?)

- k8s

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
- use events for commit/abort
