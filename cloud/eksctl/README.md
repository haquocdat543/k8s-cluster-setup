# K8s cluster setup using terraform
This is a demonstration of k8s cluster setup using eksctl collaborate with AWS ( Amazon Web Services )
## Prerequisites
eksctl installed.

aws credentials configuration.

If you dont have terraform, check [Installation](https://eksctl.io/installation/) here.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.
## Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/eksctl
```

## Initialize
```
terraform init
```
## Apply
```
terraform apply
```
if you dont want to type yes after plan you can put `--auto-approve` at the end of command. Like this `terraform apply --auto-approve`

You need to pass `aws credential profile`. If you dont type anything, it will be `default`

You need to pass linux `ami_id` ( Like this: `ami-098940df4d3292e9a` ) and and `key_pair` ( Like this: `mykey` )
## Destroy
```
terraform destroy
```
if you dont want to type yes after plan you can put `--auto-approve` at the end of command. Like this `terraform destroy --auto-approve`

