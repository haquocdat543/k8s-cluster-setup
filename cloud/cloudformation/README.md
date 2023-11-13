# K8s cluster setup using cloudformation
This is a demonstration of k8s cluster setup using cloudformation
## Prerequisites
aws credentials configuration.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.
## Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/cloudformation
```

## Deploy
```
aws cloudformation deploy --stack-name <value> --template-file <value>
```
you need to change `<value>` to `your-stack-name` and `your-template-file-path`
