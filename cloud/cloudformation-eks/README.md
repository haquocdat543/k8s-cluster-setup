# K8s cluster setup using cloudformation
This is a demonstration of k8s cluster setup using cloudformation

Note: This setup using EKS service ( Not base on EC2 and other services )
## Prerequisites
aws credentials configuration.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.
## Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/cloudformation-eks
```
## Deploy
```
aws cloudformation deploy --stack-name default --template-file k8s.yaml --capabilities CAPABILITY_IAM
```
you need to change `default` to `your-stack-name` 
## Delete
You need to change `<stack-name>` following `Deploy`
```
aws cloudformation delete-stack --stack-name <stack-name>
```

