## Docker Usage

### Technical requirements

#### Install Docker

The host machine must have Docker installed in order to build and run the Container. Instructions on how to install
Docker can be found on the official [page](https://docs.docker.com/engine/installation/)

### Usage

> All docker commands must be run from the `docker` directory

`cd ./docker`

#### Starting the containers

> This will build, and start the containers plus follow any logs

`docker-compose up --build`

#### Attaching to the containers

> This will start a shell session inside the specified container

`docker-compose exec {container-name} {shell?}`

example usage: `docker-compose exec node zsh`

#### Stopping the containers

> This will stop any running containers

`docker-compose stop`
