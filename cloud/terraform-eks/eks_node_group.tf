resource "aws_eks_node_group" "node-group-1" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "Medium-Group"
  node_role_arn   = aws_iam_role.node-group.arn
  subnet_ids      = [aws_subnet.first-subnet.id, aws_subnet.second-subnet.id]
  instance_types  = ["t3.medium"]

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly,
  ]
}

resource "aws_eks_node_group" "node-group-2" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "High-Group"
  node_role_arn   = aws_iam_role.node-group.arn
  subnet_ids      = [aws_subnet.first-subnet.id, aws_subnet.second-subnet.id]
  instance_types  = ["t3.2xlarge"]

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly,
  ]
}

