# Associate first subnet with route table
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.first-public-subnet.id
  route_table_id = aws_route_table.public-route-table.id
}

# Associate second subnet with route table
resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.second-public-subnet.id
  route_table_id = aws_route_table.public-route-table.id
}

# Associate first subnet with route table
resource "aws_route_table_association" "c" {
  subnet_id      = aws_subnet.first-private-subnet.id
  route_table_id = aws_route_table.private-route-table.id
}

# Associate second subnet with route table
resource "aws_route_table_association" "d" {
  subnet_id      = aws_subnet.second-private-subnet.id
  route_table_id = aws_route_table.private-route-table.id
}
