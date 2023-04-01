terraform {
  required_providers {
    docker = {
        source = "kreuzwerker/docker"
        version = ">=2.13.0"
    }
  }
}

provider "docker" {
  host = "npipe:////.//pipe//docker_engine"
}

resource "docker_image" "orders" {
  name = "orders"
  build {
    path = "./../"
    dockerfile = "orders.dockerfile"
  }
  keep_locally = true
  triggers = {
    dir_sha1 = sha1(join("", [for f in fileset(path.module, "../apps/orders-microservice/**/*") : filesha1(f)]))
  }
}

resource "docker_image" "payment" {
  name = "payment"
  build {
    path = "./../"
    dockerfile = "payment.dockerfile"
  }
  keep_locally = true
  triggers = {
    dir_sha1 = sha1(join("", [for f in fileset(path.module, "../apps/payment-microservice/**/*") : filesha1(f)]))
  }
}

resource "docker_image" "portal" {
  name = "portal"
  build {
    path = "./../"
    dockerfile = "portal.dockerfile"
  }
  keep_locally = true
  triggers = {
    dir_sha1 = sha1(join("", [for f in fileset(path.module, "../apps/orders-operations-portal/**/*") : filesha1(f)]))
  }
}
