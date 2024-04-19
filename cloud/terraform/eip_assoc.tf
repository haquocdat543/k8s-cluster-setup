# Associate EIP to EC2 instances ENI
resource "aws_eip_association" "eip_assoc_to_LoadBalancer" {
  instance_id   = aws_instance.LoadBalancer.id
  allocation_id = aws_eip.LoadBalancer.id
}

resource "aws_eip_association" "eip_assoc_to_Master1" {
  instance_id   = aws_instance.Master1.id
  allocation_id = aws_eip.Master1.id
}

resource "aws_eip_association" "eip_assoc_to_Master2" {
  instance_id   = aws_instance.Master2.id
  allocation_id = aws_eip.Master2.id
}
resource "aws_eip_association" "eip_assoc_to_Worker1" {
  instance_id   = aws_instance.Worker1.id
  allocation_id = aws_eip.Worker1.id
}

resource "aws_eip_association" "eip_assoc_to_Worker2" {
  instance_id   = aws_instance.Worker2.id
  allocation_id = aws_eip.Worker2.id
}


