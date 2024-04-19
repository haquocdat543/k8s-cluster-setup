# Associate first ubnet with route table
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.first-subnet.id
  route_table_id = aws_route_table.route-table.id
}

# Associate second subnet with route table
resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.second-subnet.id
  route_table_id = aws_route_table.route-table.id
}

