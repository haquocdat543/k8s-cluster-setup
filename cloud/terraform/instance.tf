# Create Ubuntu server and install/ enable apache2
resource "aws_instance" "LoadBalancer" {
  ami               = var.ami_id
  instance_type     = "t3.small"
  availability_zone = "ap-northeast-1a"
  key_name          = var.key_pair
  user_data         = file("../../scripts/nginx.sh")

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.LoadBalancer.id
  }

  tags = {
    "Name" = "LoadBalancer"
  }
}

resource "aws_instance" "Master1" {
  ami               = var.ami_id
  instance_type     = "t3.small"
  availability_zone = "ap-northeast-1a"
  key_name          = var.key_pair
  user_data         = file("../../scripts/worker.sh")

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.Master1.id
  }

  tags = {
    "Name" = "Master1"
  }
}
resource "aws_instance" "Master2" {
  ami               = var.ami_id
  instance_type     = "t3.small"
  availability_zone = "ap-northeast-1a"
  key_name          = var.key_pair
  user_data         = file("../../scripts/worker.sh")

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.Master2.id
  }

  tags = {
    "Name" = "Master2"
  }
}

resource "aws_instance" "Worker1" {
  ami               = var.ami_id
  instance_type     = "t3.small"
  availability_zone = "ap-northeast-1a"
  key_name          = var.key_pair
  user_data         = file("../../scripts/worker.sh")

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.Worker1.id
  }
  tags = {
    "Name" = "Worker1"
  }
}
resource "aws_instance" "Worker2" {
  ami               = var.ami_id
  instance_type     = "t3.small"
  availability_zone = "ap-northeast-1a"
  key_name          = var.key_pair
  user_data         = file("../../scripts/worker.sh")

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.Worker2.id
  }
  tags = {
    "Name" = "Worker2"
  }
}

