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
LoadbalancerPublicIp    13.115.209.219
Worker1PublicIp 13.230.91.147
Worker2PublicIp 57.180.34.47
Master2PublicIp 52.196.233.222
Master1PublicIp 13.114.126.227
```
## 5. LoadBalancer config

1. host configuration.
```
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

yum install nginx-mod-stream -y

cat <<EOF | sudo tee -a /etc/nginx/nginx.conf
stream {
    upstream kubernetes {
        server master1:6443 max_fails=3 fail_timeout=30s;
        server master2:6443 max_fails=3 fail_timeout=30s;
    }
server {
        listen 6443;
        listen 8080;
        proxy_pass kubernetes;
    }
}
EOF
```
You need to ssh into `loadbalancer` instance and run following commands:

You need to change `<loadbalancer-ip>`, `<master-ip>`, `<master2-ip>` follow your output.

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
kubeadm join loadbalancer:6443 --token k8c76a.4stzlrzj7ae27ydf \
        --discovery-token-ca-cert-hash sha256:55121a7f7f685067584ae6981537e76ed39d35a3ac3d94d361f5e1fd8993bf13 \
        --control-plane --certificate-key 7234d6f14ee95b70c24370ffebde22e320f0cac66f3370d55eec788ec69fcc4c
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
## 7. Delete
You need to change `<stack-name>` following `Deploy`
```
aws cloudformation delete-stack --stack-name <stack-name>
```

