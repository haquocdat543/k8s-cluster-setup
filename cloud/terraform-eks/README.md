# K8s cluster setup using Terraform
This is a demonstration of k8s cluster setup using Terraform collaborate with AWS ( Amazon Web Services ) ( EKS )

Note: This is using EKS service ( Not base on EC2 and other services )
## 1. Prerequisites
terraform installed.

aws credentials configuration.

kubectl.

If you dont have terraform, check [Installation](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) here.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.

If you dont have kubectl, check [Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) here.
## 2. Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/terraform
```

## 3. Initialize
```
terraform init
```
## 4. Apply
```
terraform apply
```
if you dont want to type yes after plan you can put `--auto-approve` at the end of command. Like this `terraform apply --auto-approve`

You need to pass `aws credential profile`. If you dont type anything, it will be `default`

```
Outputs:
endpoint = "https://887EDCE873A65FD6DFC2D6AA9321AE24.gr7.ap-northeast-1.eks.amazonaws.com"
```
## 5. Kubeconfig
```
aws eks update-kubeconfig --name my-eks
```
```
Updated context arn:aws:eks:ap-northeast-1:095368940515:cluster/my-eks in /root/
.kube/config
[root@ip-172-31-12-244 cloudformation-eks]#
```
## 6. Test
```
[root@ip-172-31-12-244 terraform-eks]# kgn
NAME                                           STATUS   ROLES    AGE    VERSION
ip-10-0-0-94.ap-northeast-1.compute.internal   Ready    <none>   8m2s   v1.28.3-
eks-4f4795d
[root@ip-172-31-12-244 terraform-eks]#
```
## 7. Destroy
```
terraform destroy
```
if you dont want to type yes after plan you can put `--auto-approve` at the end of command. Like this `terraform destroy --auto-approve`

