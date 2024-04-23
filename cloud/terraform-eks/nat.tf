resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "Kubernetes-Nat-Gateway-EIP"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.first-public-subnet.id

  tags = {
    Name = "Kubernetes-Nat-Gateway"
  }

  depends_on = [aws_internet_gateway.gw]
}

