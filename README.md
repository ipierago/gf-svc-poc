# GuildFi Microservices Proof of Concept (gf-svc-poc)

This is the companion repo for the document Microservices Architecture TDD. It demonstrates many of the ideas presented there.

It demonstrates:

- core monolithic backend supported by microservices
- Optimistic locking for concurrency conflicts within a service
- Two-Phase Commit (2PC) for concurrency conflicts between services
- transactional outbox pattern using logical replication for finalization
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

## Setup

From the root folder:

```bash
yarn install
```

When building docker images, use the root folder as the context.

### Docker Desktop and Skaffold

If you plan on using skaffold, you'll need to do the following setup.

Turn on Kubernetes in the Docker Desktop configuration

Switch k8s context to use Docker Desktop (use "docker-for-desktop" for MacOS):

```bash
kubectl config use-context docker-desktop
```

You can switch back to the gf cloud environment using:

```bash
kubectl config get-contexts
kubectl config use-context gke_virtual-sylph-363317_asia-southeast1-b_gke-project-z-cluster-stg
```

Make sure you are running a recent version of node. Use the following to list available versions:

```bash
nvm ls
```

The following is usually a good version to use:

```bash
nvm use stable
```

## Build and run

You can either build and run with skaffold or docker compose. If you use skaffold, the full k8s setup will be initialized including multiple instances of the microservices and load balancing via nginx ingress controller. If you use docker compose, you won't get the full setup, but it will be faster.

### Docker compose

This is the easiest/quickest way to build and run.

```bash
docker compose up --build
```

The database contents will be saved between runs. If you want to clear the databases, use the following command to delete all the images.

```bash
docker compose down --rmi all
```

### Skaffold/K8s

Using skaffold will initialize the full k8s setup including multiple instances of services load balanced by an ingress controller. However, there are two know issues with this setup.

The nginx ingress controller doesn't always boot up correctly, so I've removed it from the skaffold yaml. You must deploy nginx ingress controller manually before running skaffold dev.

Install nginx ingress controller (https://kubernetes.github.io/ingress-nginx/deploy/)

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.6/deploy/static/provider/cloud/deploy.yaml
```

Check that it is running:

```bash
kubectl get pods --namespace=ingress-nginx
```

To shutdown:

```bash
kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.6/deploy/static/provider/cloud/deploy.yaml
```

Next, run skaffold dev:

```bash
skaffold dev
```

If you have trouble, try waiting a moment and running again. Sometimes nginx deploy in the first step takes awhile to stabilize.

If you continue to have trouble, restart the Kubernetes cluster from the "Settings" menu on Docker Desktop.

Logs are not shown in the console when using skaffold. This is a known issue.

### Manual build

If you are building manually, you'll need to build the shared libary first.

```bash
cd ../shared
yarn build
```

If you make changes to the proto files (i.e. the gRPC API), you need to build the protos. Generated source files are committed.

```bash
cd ../shared
yarn build:protos
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
yarn dev -- ls
yarn dev -- create-user my-name
yarn dev -- create-item my-item 10
yarn dev -- create-marketplace-item 1 12
yarn dev -- user-gxp-add 1 100
yarn dev -- buy-marketplace-item 1 1
yarn dev -- ls
```

```bash
cd cli
yarn dev -- marketplace-svc-info
yarn dev -- user-svc-info
yarn dev -- item-svc-info
yarn dev -- gxp-svc-info
```

There are no volumes defined, but if you do not rm the container, the contents of the database persist between runs.

## Known Issues

There is an initialization order problem. backend needs to wait for gxp and then connect gRPC. gxp needs to wait for backend and then create subscription. The current work around is to initialize the logical replication via an init script in the docker container.

## TODO

- aborting timed out pending commits
- remove updatedAt
- example of long running business logic
- example of (pub/sub in backend)
- convert gxp to golang or rust
