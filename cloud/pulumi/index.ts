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

const loadbalancerNetworkInterface = new aws.ec2.NetworkInterface("loadbalancer", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.50"],
    securityGroups: [k8sSecurityGroup.id],
});

const master1NetworkInterface = new aws.ec2.NetworkInterface("master1", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.51"],
    securityGroups: [k8sSecurityGroup.id],
});

const master2NetworkInterface = new aws.ec2.NetworkInterface("master2", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.52"],
    securityGroups: [k8sSecurityGroup.id],
});

const worker1NetworkInterface = new aws.ec2.NetworkInterface("worker1", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.53"],
    securityGroups: [k8sSecurityGroup.id],
});

const worker2NetworkInterface = new aws.ec2.NetworkInterface("worker2", {
    subnetId: subnet.id,
    privateIps: ["10.0.0.54"],
    securityGroups: [k8sSecurityGroup.id],
});

const loadbalancerEIP = new awsNative.ec2.Eip("loadbalancer", { domain: "vpc"});
const master1EIP = new awsNative.ec2.Eip("master1", { domain: "vpc" });
const master2EIP = new awsNative.ec2.Eip("master2", { domain: "vpc" });
const worker1EIP = new awsNative.ec2.Eip("worker1", { domain: "vpc" });
const worker2EIP = new awsNative.ec2.Eip("worker2", { domain: "vpc" });

// (optional) create a simple web server using the startup script for the instance
// Create a FileAsset for your user data script
let masterUserData = fs.readFileSync('../../scripts/master.sh', 'utf-8');
let workerUserData = fs.readFileSync('../../scripts/worker.sh', 'utf-8');
let loadbalancerUserData = fs.readFileSync('../../scripts/nginx.sh', 'utf-8');

const loadbalancer = new aws.ec2.Instance("loadbalancer", {
    tags: { "Name": "loadbalancer" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(loadbalancerUserData).toString('base64'),              // start a simple web server
});

const master1 = new aws.ec2.Instance("master1", {
    tags: { "Name": "master1" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(masterUserData).toString('base64'),              // start a simple web server
});

const master2 = new aws.ec2.Instance("master2", {
    tags: { "Name": "master2" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(masterUserData).toString('base64'),              // start a simple web server
});

const worker1 = new aws.ec2.Instance("worker1", {
    tags: { "Name": "worker1" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(workerUserData).toString('base64'),              // start a simple web server
});

const worker2 = new aws.ec2.Instance("worker2", {
    tags: { "Name": "worker2" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the k8sSecurityGroup object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(workerUserData).toString('base64'),              // start a simple web server
});

const loadbalancerEIPAttachment = new aws.ec2.NetworkInterfaceAttachment("eipAssocToLoadBalancer", {
    networkInterfaceId: loadbalancerNetworkInterface.id,
    instanceId: loadbalancer.id,
    deviceIndex: 1,
});

const master1EIPAttachment = new aws.ec2.NetworkInterfaceAttachment("eipAssocToMaster1", {
    networkInterfaceId: master1NetworkInterface.id,
    instanceId: master1.id,
    deviceIndex: 1,
});

const master2EIPAttachment = new aws.ec2.NetworkInterfaceAttachment("eipAssocToMaster2", {
    networkInterfaceId: master2NetworkInterface.id,
    instanceId: master2.id,
    deviceIndex: 1,
});

const worker1EIPAttachment = new aws.ec2.NetworkInterfaceAttachment("eipAssocToWorker1", {
    networkInterfaceId: worker1NetworkInterface.id,
    instanceId: worker1.id,
    deviceIndex: 1,
});

const worker2EIPAttachment = new aws.ec2.NetworkInterfaceAttachment("eipAssocToWorker2", {
    networkInterfaceId: worker2NetworkInterface.id,
    instanceId: worker2.id,
    deviceIndex: 1,
});

export const loadbalancerpublicIp = loadbalancer.publicIp;
export const loadbalancerpublicDns = loadbalancer.publicDns;
export const worker1publicIp = worker1.publicIp;
export const worker1publicDns = worker1.publicDns;
export const master2publicIp = master2.publicIp;
export const master2publicDns = master2.publicDns;
