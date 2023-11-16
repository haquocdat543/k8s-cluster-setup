# K8s cluster setup using cloudformation
This is a demonstration of k8s cluster setup using cloudformation

Note: This setup using EKS service ( Not base on EC2 and other services )
## 1. Prerequisites
aws credentials configuration.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.
## 2. Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/cloudformation-eks
```
## 3. Deploy
you need to change `default` to `your-stack-name` 
```
aws cloudformation deploy --stack-name default --template-file k8s.yaml --capabilities CAPABILITY_IAM
```
```
[root@ip-172-31-12-244 cloudformation-eks]# aws cloudformation deploy --stack-na
me default --template-file k8s.yaml --capabilities CAPABILITY_IAM
Waiting for changeset to be created..
Waiting for stack create/update to complete
Successfully created/updated stack - default
```

## 4. Output
```
aws cloudformation describe-stacks --query Stacks[].Outputs[*].[OutputKey,OutputValue] --output text
```
```
[root@ip-172-31-12-244 cloudformation-eks]# aws cloudformation describe-stacks -
-query Stacks[].Outputs[*].[OutputKey,OutputValue] --output text
EksClusterEndpoint      https://84830A52FB1639240A14283F19A60348.gr7.ap-northeas
t-1.eks.amazonaws.com
[root@ip-172-31-12-244 cloudformation-eks]#
```

## 5. Kubeconfig 
```
aws eks update-kubeconfig --name EKSCluster
```
```
[root@ip-172-31-12-244 cloudformation-eks]# aws eks update-kubeconfig --name EKSC
luster
Added new context arn:aws:eks:ap-northeast-1:095368940515:cluster/EKSCluster to
/root/.kube/config
```

## 6. Test
```
[root@ip-172-31-12-244 cloudformation-eks]# kubectl get nodes
NAME                                            STATUS   ROLES    AGE     VERSIO
N
ip-10-0-0-148.ap-northeast-1.compute.internal   Ready    <none>   7m52s   v1.28.
3-eks-4f4795d
ip-10-0-0-26.ap-northeast-1.compute.internal    Ready    <none>   7m51s   v1.28.
3-eks-4f4795d
ip-10-0-0-73.ap-northeast-1.compute.internal    Ready    <none>   7m52s   v1.28.
3-eks-4f4795d
ip-10-0-1-25.ap-northeast-1.compute.internal    Ready    <none>   7m47s   v1.28.
3-eks-4f4795d
ip-10-0-1-30.ap-northeast-1.compute.internal    Ready    <none>   7m47s   v1.28.
3-eks-4f4795d
[root@ip-172-31-12-244 cloudformation-eks]#
```

## 7. Delete
You need to change `<stack-name>` following `Deploy`
```
aws cloudformation delete-stack --stack-name <stack-name>
```

