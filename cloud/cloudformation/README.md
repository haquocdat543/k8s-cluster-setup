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
you need to change `default`
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
## 5. LoadBalancer config
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
## 6. Controlplane config
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
## 7. Delete
You need to change `<stack-name>` following `Deploy`
```
aws cloudformation delete-stack --stack-name <stack-name>
```

