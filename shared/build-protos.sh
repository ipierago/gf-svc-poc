#!/bin/bash

pushd protos
mkdir -p ../src/gen
protoc --plugin=$BERRY_BIN_FOLDER/protoc-gen-ts_proto --ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true --ts_proto_out=../src/gen --proto_path=./ *.proto
popd

#mkdir -p ./gen/go
#protoc --go_out=./gen/go *.proto
