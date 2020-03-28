#!/bin/bash

set -e

host="conteiner_a"
port="8000"
cmd="$@"

>&2 echo "!!!!!!!! Check conteiner_a for available !!!!!!!!"

until curl http://"$host":"$port"; do
  >&2 echo "Conteiner_A is unavailable - sleeping"
  sleep 1
done

>&2 echo "Conteiner_A is up - executing command"

exec $cmd
