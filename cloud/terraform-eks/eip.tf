resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "Development-Kubernetes-Subnet-NAT-Gateway-EIP"
  }
}
