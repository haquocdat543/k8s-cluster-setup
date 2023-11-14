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

1. hostname configuration
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

## Destroy
```
terraform destroy
```
if you dont want to type yes after plan you can put `--auto-approve` at the end of command. Like this `terraform destroy --auto-approve`

