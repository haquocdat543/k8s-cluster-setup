# K8s cluster setup using EKSCTL
This is a demonstration of k8s cluster setup using eksctl collaborate with AWS ( Amazon Web Services )
## 1. Prerequisites
eksctl installed.

aws credentials configuration.

kubectl installed.

If you dont have eksctl, check [Installation](https://eksctl.io/installation/) here.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.

If you dont have kubectl, check [Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) here.
## 2. Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/eksctl
```
## 3. Initialize cluster
Copy and chnage following commands:

`<cluster-name>` to whatever you want

`<kubernetes-version>` to whatever version you want. At the time I write this, the newest is `1.28`. You can check [k8s](https://kubernetes.io) for more information.

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
## 4. Kubeconfig
```
aws eks update-kubeconfig --name <cluster-name>
```
Result:
```
Updated context arn:aws:eks:ap-northeast-1:095368940515:cluster/my-eks in /root/
.kube/config
[root@ip-172-31-4-174 cloudformation-eks]#
```

## 5. Test
```
[root@ip-172-31-4-174 cloudformation-eks]# kubectl get nodes
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

## 6. Delete cluster
You need to change `<cluster-name>` to cluster which you want delete.
```
eksctl delete cluster --name <cluster-name>
```

