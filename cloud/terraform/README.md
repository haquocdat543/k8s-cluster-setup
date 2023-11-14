# K8s cluster setup using terraform
This is a demonstration of k8s cluster setup using terraform collaborate with AWS ( Amazon Web Services )
## Prerequisites
terraform installed.

aws credentials configuration.

If you dont have terraform, check [Installation](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) here.

If you dont have awscli and configure credentials, check [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Configure](https://docs.aws.amazon.com/cli/latest/reference/configure/) here.
## Clone repository
```
git clone https://github.com/haquocdat543/k8s-cluster-setup.git
cd k8s-cluster-setup/cloud/terraform
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
### Output
After finish the output may be like this:
```
LoadBalancer = "ssh -i ~/Window2.pem ec2-user@3.115.183.222"
Master1 = "ssh -i ~/Window2.pem ec2-user@54.92.71.82"
Master2 = "ssh -i ~/Window2.pem ec2-user@52.195.63.53"
Worker1 = "ssh -i ~/Window2.pem ec2-user@52.192.58.229"
Worker2 = "ssh -i ~/Window2.pem ec2-user@3.115.125.101"
```
### LoadBalancer config
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
### Controlplane config
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


## Destroy
```
terraform destroy
```
if you dont want to type yes after plan you can put `--auto-approve` at the end of command. Like this `terraform destroy --auto-approve`

