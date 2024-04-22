# Create a Subnet
resource "aws_subnet" "first-subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name"                                      = "Developement-Kubernetes-First-Subnet"
    "kubernetes.io/role/internal"               = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

# Create a Subnet
resource "aws_subnet" "second-subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = true

  tags = {
    "Name"                                      = "Developement-Kubernetes-Second-Subnet"
    "kubernetes.io/role/internal"               = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}
