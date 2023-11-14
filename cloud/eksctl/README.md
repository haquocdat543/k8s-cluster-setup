# K8s cluster setup using terraform
This is a demonstration of k8s cluster setup using eksctl collaborate with AWS ( Amazon Web Services )
## Prerequisites
eksctl installed.

aws credentials configuration.

If you dont have eksctl, check [Installation](https://eksctl.io/installation/) here.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.
## Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/eksctl
```
## Initialize cluster
Copy and chnage following commands:

`<cluster-name` to whatever you want

`<kubernetes-version>` to whatever version you want. At the the I write this, the newest is 1.28. You can check [k8s](https://kubernetes.io) for more information.

`<aws-region>` to whatever you want. Example: `ap-northeast-1`, `ap-southeast-1`. Check [region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) for more information.

`<nodegroup-name>` to whatever you want.

`<node-type>` to whatever you want. Example: `t3.small`.

`<nodes>` to ammount that you want. Example: `3`
```
eksctl create cluster \
--name <cluster-name> \
--version <kubernetes-version> \
--region <aws-region> \
--nodegroup-name <nodegroup-name> \
--node-type <instance-type> \
--nodes <node-ammount> \
```

