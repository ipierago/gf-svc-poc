#!/bin/bash

pushd protos
mkdir -p ../src/gen
protoc --plugin=../node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true --ts_proto_out=../src/gen --proto_path=./ *.proto
popd

#mkdir -p ./gen/go
#protoc --go_out=./gen/go *.proto


#cp -Rf ./gen ../backend/src
#cp -Rf ./gen ../frontend/src
#cp -Rf ./gen ../gxp/src
#cp -Rf ./gen ../shared/src