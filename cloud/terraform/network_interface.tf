# Create a network interface with an ip in the subnet that was created step 4
resource "aws_network_interface" "LoadBalancer" {
  subnet_id       = aws_subnet.ProdSubnet.id
  private_ips     = ["10.0.0.50"]
  security_groups = [aws_security_group.ProdSecurityGroup.id]
}
resource "aws_network_interface" "Master1" {
  subnet_id       = aws_subnet.ProdSubnet.id
  private_ips     = ["10.0.0.51"]
  security_groups = [aws_security_group.ProdSecurityGroup.id]
}
resource "aws_network_interface" "Master2" {
  subnet_id       = aws_subnet.ProdSubnet.id
  private_ips     = ["10.0.0.52"]
  security_groups = [aws_security_group.ProdSecurityGroup.id]
}
resource "aws_network_interface" "Worker1" {
  subnet_id       = aws_subnet.ProdSubnet.id
  private_ips     = ["10.0.0.53"]
  security_groups = [aws_security_group.ProdSecurityGroup.id]
}
resource "aws_network_interface" "Worker2" {
  subnet_id       = aws_subnet.ProdSubnet.id
  private_ips     = ["10.0.0.54"]
  security_groups = [aws_security_group.ProdSecurityGroup.id]
}

