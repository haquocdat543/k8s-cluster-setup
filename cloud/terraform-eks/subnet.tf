# Create a Subnet
resource "aws_subnet" "first-public-subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.0.0/19"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name"                                      = "Developement-Kubernetes-First-Public-Subnet"
    "kubernetes.io/role/internal"               = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

# Create a Subnet
resource "aws_subnet" "second-public-subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.32.0/19"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = true

  tags = {
    "Name"                                      = "Developement-Kubernetes-Public-Second-Subnet"
    "kubernetes.io/role/internal"               = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

# Create a Subnet
resource "aws_subnet" "first-private-subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.64.0/19"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name"                                      = "Developement-Kubernetes-Private-First-Subnet"
    "kubernetes.io/role/internal"               = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

# Create a Subnet
resource "aws_subnet" "second-private-subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.96.0/19"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = true

  tags = {
    "Name"                                      = "Developement-Kubernetes-Second-Private-Subnet"
    "kubernetes.io/role/internal"               = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}
