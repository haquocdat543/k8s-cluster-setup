# Create Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "Developement-Kubernetes-Internet-Gateway"
  }
}

