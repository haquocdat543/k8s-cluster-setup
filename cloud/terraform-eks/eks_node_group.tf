resource "aws_eks_node_group" "node-group-1" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "Medium-Group"
  node_role_arn   = aws_iam_role.ec2_node_group.arn
  instance_types  = ["t3.medium"]
  version         = "1.29"

  subnet_ids = [
    aws_subnet.first-subnet.id,
    aws_subnet.second-subnet.id
  ]

  scaling_config {
    desired_size = 1
    max_size     = 9
    min_size     = 0
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    role = "general-purpose"
  }

  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly,
  ]
}
