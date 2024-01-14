// Copyright 2016-2021, Pulumi Corporation.  All rights reserved.

import * as fs from "fs";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as awsNative from "@pulumi/aws-native";

// Get the id for the latest Amazon Linux AMI
const ami = "ami-098940df4d3292e9a"
const key = "Window2"

// Create a new VPC
const vpc = new aws.ec2.Vpc("my-vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
});

// Create a new subnet within the VPC
const subnet = new aws.ec2.Subnet("my-subnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.0.0/24",
    availabilityZone: "ap-northeast-1a",
});

// Create a security group
const k8sSecurityGroup = new aws.ec2.SecurityGroup("k8s-security-group", {
    vpcId: vpc.id,
    ingress: [
        // Allow all inbound traffic (ingress) from any source IP
        {
            protocol: "-1", // All protocols
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
    egress: [
        // Allow all outbound traffic (egress) to any destination IP
        {
            protocol: "-1", // All protocols
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
});
const loadbalancerEIP = new awsNative.ec2.Eip("loadbalancer", {});
const master1EIP = new awsNative.ec2.Eip("master1", {});
const master2EIP = new awsNative.ec2.Eip("master2", {});
const worker1EIP = new awsNative.ec2.Eip("worker1", {});
const worker2EIP = new awsNative.ec2.Eip("worker2", {});

// (optional) create a simple web server using the startup script for the instance
// Create a FileAsset for your user data script
let masterUserData = fs.readFileSync('../../scripts/master.sh', 'utf-8');
let workerUserData = fs.readFileSync('../../scripts/worker.sh', 'utf-8');
let loadbalancerUserData = fs.readFileSync('../../scripts/nginx.sh', 'utf-8');

const loadbalancer = new aws.ec2.Instance("loadbalancer", {
    tags: { "Name": "loadbalancer" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(loadbalancerUserData).toString('base64'),              // start a simple web server
});

const master1 = new aws.ec2.Instance("master1", {
    tags: { "Name": "master1" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(masterUserData).toString('base64'),              // start a simple web server
});

const master2 = new aws.ec2.Instance("master2", {
    tags: { "Name": "master2" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(masterUserData).toString('base64'),              // start a simple web server
});

const worker1 = new aws.ec2.Instance("worker1", {
    tags: { "Name": "worker1" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(workerUserData).toString('base64'),              // start a simple web server
});

const worker2 = new aws.ec2.Instance("worker2", {
    tags: { "Name": "worker2" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the k8sSecurityGroup object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(workerUserData).toString('base64'),              // start a simple web server
});

new aws.ec2.EipAssociation("eipAssocToLoadBalancer", {
    instanceId: loadbalancer.id,
    publicIp: loadbalancer.publicIp,
});

new aws.ec2.EipAssociation("eipAssocToMaster1", {
    instanceId: master1.id,
    publicIp: master1.publicIp,
});

new aws.ec2.EipAssociation("eipAssocToMaster2", {
    instanceId: master2.id,
    publicIp: master2.publicIp,
});

new aws.ec2.EipAssociation("eipAssocToWorker1", {
    instanceId: worker1.id,
    publicIp: worker1.publicIp,
});

new aws.ec2.EipAssociation("eipAssocToWorker2", {
    instanceId: worker2.id,
    publicIp: worker2.publicIp,
});

const loadbalancerNetworkInterface = new aws.ec2.NetworkInterface("loadbalancer", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.50"],
    securityGroups: [k8sSecurityGroup.id],
    attachments: [{
        instance: loadbalancer.id,
        deviceIndex: 1,
    }],
});

const master1NetworkInterface = new aws.ec2.NetworkInterface("master1", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.51"],
    securityGroups: [k8sSecurityGroup.id],
    attachments: [{
        instance: master1.id,
        deviceIndex: 1,
    }],
});

const master2NetworkInterface = new aws.ec2.NetworkInterface("master2", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.52"],
    securityGroups: [k8sSecurityGroup.id],
    attachments: [{
        instance: master2.id,
        deviceIndex: 1,
    }],
});

const worker1NetworkInterface = new aws.ec2.NetworkInterface("worker1", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.53"],
    securityGroups: [k8sSecurityGroup.id],
    attachments: [{
        instance: worker1.id,
        deviceIndex: 1,
    }],
});

const worker2NetworkInterface = new aws.ec2.NetworkInterface("worker2", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.54"],
    securityGroups: [k8sSecurityGroup.id],
    attachments: [{
        instance: worker2.id,
        deviceIndex: 1,
    }],
});

export const loadbalancerpublicIp = loadbalancer.publicIp;
export const loadbalancerpublicDns = loadbalancer.publicDns;
export const worker1publicIp = worker1.publicIp;
export const worker1publicDns = worker1.publicDns;
export const worker2publicIp = worker2.publicIp;
export const worker2publicDns = worker2.publicDns;
export const master1publicIp = master1.publicIp;
export const master1publicDns = master1.publicDns;
export const master2publicIp = master2.publicIp;
export const master2publicDns = master2.publicDns;
