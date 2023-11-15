# K8s cluster setup using Cloudformation
This is a demonstration of k8s cluster setup using Cloudformation

Note: This is not using EKS service ( Just base on EC2 and other services )
## 1. Prerequisites
aws credentials configuration.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.
## 2. Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/cloudformation
```

## 3. Deploy
```
aws cloudformation create-stack --stack-name default --template-body file://k8s.yaml --parameters ParameterKey=UserData,ParameterValue=$(base64 -w0 ../../scripts/worker.sh)
```
you need to change `<value>` to `your-stack-name` and `your-template-file-path`
## 4. Get output
Run the following command to get output:
```
aws cloudformation describe-stacks --query Stacks[].Outputs[*].[OutputKey,OutputValue] --output text
```
Output will be like this:
```
[root@ip-172-31-3-9 cloudformation]# aws cloudformation describe-stacks --query
Stacks[].Outputs[*].[OutputKey,OutputValue] --output text
LoadbalancerPublicIp    57.180.65.113
Worker1PublicIp 52.194.212.194
Worker2PublicIp 43.207.201.51
Master2PublicIp 13.230.193.146
Master1PublicIp 54.168.2.22
[root@ip-172-31-3-9 cloudformation]#
```
## Delete
You need to change `<stack-name>` following `Deploy`
```
aws cloudformation delete-stack --stack-name <stack-name>
```

