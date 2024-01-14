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
cd k8s-cluster-setup/cloud/pulumi
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
Set config

Replace <ap-northeast-1> to your customize
```
pulumi config set aws-native:region ap-northeast-1
```

```
pulumi up
```
Then use arrow to choose `yes`

## 7. Output
After finish the output may be like this:
```
loadbalancerpublicDns: "ec2-18-183-51-246.ap-northeast-1.compute.amazonaws.com"
loadbalancerpublicIp : "18.183.51.246"
master1publicDns     : "ec2-13-230-224-196.ap-northeast-1.compute.amazonaws.com"
master1publicIp      : "13.230.224.196"
master2publicDns     : "ec2-54-95-122-78.ap-northeast-1.compute.amazonaws.com"
master2publicIp      : "54.95.122.78"
worker1publicDns     : "ec2-54-168-233-72.ap-northeast-1.compute.amazonaws.com"
worker1publicIp      : "54.168.233.72"
worker2publicDns     : "ec2-52-194-240-239.ap-northeast-1.compute.amazonaws.com"
worker2publicIp      : "52.194.240.239"
```
## 8. LoadBalancer configure
You need to ssh into `loadbalancer` instance and run following commands:

You need to change `<loadbalancer-ip>`, `<master-ip>`, `<master2-ip>` follow your output.

1. host configuration.
```
echo "<loadbalancer-ip> loadbalancer" >> /etc/hosts
echo "<master1-ip> master1" >> /etc/hosts
echo "<master2-ip> master2" >> /etc/hosts
```
2. Restart nginx.
```
nginx -t
sudo systemctl restart nginx
```
## 9. Controlplane configure
After loadbalancer config. You need to ssh to first master node and run following commands:

You need to change `<loadbalancer-ip>` follow your output.

1. hostname configuration ( Run on all nodes ).
```
echo "<loadbalancer-ip> loadbalancer" >> /etc/hosts
```
2. Initilize controlplane 
```
sudo kubeadm init \
  --pod-network-cidr=172.24.0.0/16 \
  --cri-socket unix:///run/containerd/containerd.sock \
  --upload-certs \
  --control-plane-endpoint=loadbalancer:6443
```
The output will has following lines:
```
kubeadm join loadbalancer:6443 --token zt55kb.k0jj3g9b1dnimxjh \
        --discovery-token-ca-cert-hash sha256:62c6084eee6237c89b0b4e6967dcbe684901b465a66e42de6b79621ad05292de \
        --control-plane --certificate-key 63531013ada7d33ee5bbf5d07d5cf0b71b0e5f4c19a415028309e6c48b404826
```
Copy it and run on each master node.

3. Finish setup

Copy the following commands and run it on each master node.
```
mkdir -p $HOME/.kube
sudo cp -f /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
sudo cp /etc/kubernetes/admin.conf /root/.kube/config
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```
4. Add worker node.

4.1 print join command.
```
kubeadm token create --print-join-command
```
The output will be like this:
```
kubeadm join loadbalancer:6443 --token zt55kb.k0jj3g9b1dnimxjh \
        --discovery-token-ca-cert-hash sha256:62c6084eee6237c89b0b4e6967dcbe684901b465a66e42de6b79621ad05292de
```

4.2 add worker.

Copy the output of `4.1` and run it on each worker node

5. Check if success.

Run following command:
```
kubectl get nodes
```
Result will be like this:
```
[root@ip-10-0-0-51 ~]# kubectl get nodes
NAME                                           STATUS   ROLES           AGE
VERSION
ip-10-0-0-51.ap-northeast-1.compute.internal   Ready    control-plane   17m
v1.28.3
ip-10-0-0-52.ap-northeast-1.compute.internal   Ready    control-plane   7m6s
v1.28.3
ip-10-0-0-53.ap-northeast-1.compute.internal   Ready    <none>          3m52s
v1.28.3
ip-10-0-0-54.ap-northeast-1.compute.internal   Ready    <none>          3m48s
v1.28.3
[root@ip-10-0-0-51 ~]#
```
## 10. Destroy
```
pulumi destroy
```
Then use arrow to choose `yes`
```
pulumi stack rm <your-organization>/<project>/<env>
```
