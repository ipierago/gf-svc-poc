# GuildFi Microservices Proof of Concept (gf-svc-poc)

This is the companion repo for the document Microservices and Concurrency TDD. It demonstrates many of the ideas presented there.

It demonstrates:

- gRPC
- Two-Phase Commit (2PC)
- Optimistic locking
- Pub/Sub

## SETUP

### Docker Desktop and Skaffold (PREFERRED)

Turn on Kubernetes in the Docker Desktop configuration

Switch k8s context to use Docker Desktop (use "docker-for-desktop" for MacOS):

```bash
kubectl config use-context docker-desktop
```

## Build and deploy

You can either build and deploy with skaffold/k8s or docker compose.

### Skaffold/K8s

```bash
skaffold dev
```

### Docker compose

```bash
docker compose up --build
```

### Manual build

If you are building manually, you'll need to build the shared libary first.

```bash
cd ../shared
npm run build
```

## Troubleshooting

Trace debug level for skaffold:

```bash
skaffold dev -v trace
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

- k8s
- load balance api route

- long running business logic
- (pub/sub in backend)
- use events for commit/abort

- do something with frontend

- gxp
  - convert gxp to golang
  - in-memory cache
    - initialize with pending operations and recently updated transactions
    - heartbeat saves
  - backed by db
