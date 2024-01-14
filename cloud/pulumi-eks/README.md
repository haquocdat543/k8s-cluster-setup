# K8s cluster setup using Pulumi
This is a demonstration of k8s cluster setup using Pulumi collaborate with AWS ( Amazon Web Services ) ( EKS )

Note: This is using EKS service ( Not base on EC2 and other services )
## 1. Prerequisites
* [git](https://git-scm.com/downloads)
* [awscli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [config-profile](https://docs.aws.amazon.com/cli/latest/reference/configure/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [pulumi](https://www.pulumi.com/docs/install/)
* [pulumi-token](https://www.pulumi.com/docs/pulumi-cloud/access-management/access-tokens/)
* [nodejs](https://nodejs.org/en/download/package-manager)
## 2. Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/pulumi-eks
```

## 3. Pulumi login
```
pulumi login
```
Then paste you `access_token`

## 4. Initialize project
```
pulumi stack init
```
## 5. Install dependency
```
npm install
```
## 6. Create infrastructure
```
pulumi up
```
Then use arrow to choose `yes`

## 6. Kubeconfig
```
aws eks update-kubeconfig --name <your-eks-cluster>
```
```
Updated context arn:aws:eks:ap-northeast-1:095368940515:cluster/<your-eks-cluster> in /root/
.kube/config
[root@ip-172-31-12-244 pulumi-eks]#
```
## 7. Test
```
[root@ip-172-31-12-244 pulumi-eks]# kgn
NAME                                           STATUS   ROLES    AGE    VERSION
ip-10-0-0-94.ap-northeast-1.compute.internal   Ready    <none>   8m2s   v1.28.3-
eks-4f4795d
[root@ip-172-31-12-244 pulumi-eks]#
```
## 8. Destroy
```
pulumi destroy
```
Then use arrow to choose `yes`
```
pulumi stack rm <your-organization>/<project>/<env>
```

