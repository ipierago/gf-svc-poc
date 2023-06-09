# GuildFi Microservices Proof of Concept (gf-svc-poc)

This is the companion repo for the document Microservices Architecture TDD. It demonstrates many of the ideas presented there.

It demonstrates:

- core monolithic backend supported by microservices
- Optimistic locking for concurrency conflicts within a service
- Two-Phase Commit (2PC) for concurrency conflicts between services
- k8s and docker deployment
- ingress-nginx to load balance routes
- gRPC for RPC calls
- pub/sub with RabbitMQ
- Protobuffers and abstraction layer

Components:
- backend: core systems
- gxp: GXP transaction microservice
- eventlog: ancillary microservice
- cli: command line interface to backend
- k8s: kubernetes configuration
- shared: protobuffers and abstraction layer

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

There is a known issue with skaffold that the nginx stuff doesn't always boot up correctly, so I've disable it for now. You must deploy nginx ingress controller manually before running skaffold dev.

Install nginx ingress controller (https://kubernetes.github.io/ingress-nginx/deploy/)

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml
```

Check that it is running:

```bash
kubectl get pods --namespace=ingress-nginx
```

To shutdown:

```bash
kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml
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
npm run dev -- info-ls
npm run dev -- create-user my-name
npm run dev -- create-item my-item 10
npm run dev -- create-marketplace-item 1 12
npm run dev -- user-gxp-add 1 100
npm run dev -- buy-marketplace-item 1 1
npm run dev -- ls
```

```bash
cd cli
npm run dev -- marketplace-svc-info
npm run dev -- user-svc-info
npm run dev -- item-svc-info
npm run dev -- gxp-svc-info
```

There are no volumes defined, but if you do not rm the container, the contents of the database persist between runs.

## TODO

- aborting timed out pending commits
- remove updatedAt
- example of long running business logic
- example of (pub/sub in backend)
- use events for commit/abort
- convert gxp to golang
- gxp in-memory cache saved regularly to db
