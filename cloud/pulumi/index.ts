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
    mapPublicIpOnLaunch: true,
});

// Create an internet gateway
const internetGateway = new aws.ec2.InternetGateway("k8s-internet-gateway", {
  vpcId: vpc.id,
});

// Create a route table
const routeTable = new aws.ec2.RouteTable("public-route-table", {
  vpcId: vpc.id,
  routes: [{
    cidrBlock: "0.0.0.0/0",
    gatewayId: internetGateway.id,
  }],
});

// Associate the route table with the public subnet
new aws.ec2.RouteTableAssociation("public-route-table-association", {
  subnetId: subnet.id,
  routeTableId: routeTable.id,
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

const LoadbalancerEip = new aws.ec2.Eip("Loadbalancer-eip", { domain: "vpc" });
const Master1Eip = new aws.ec2.Eip("Master1-eip", { domain: "vpc" });
const Master2Eip = new aws.ec2.Eip("Master2-eip", { domain: "vpc" });
const Worker1Eip = new aws.ec2.Eip("Worker1-eip", { domain: "vpc" });
const Worker2Eip = new aws.ec2.Eip("Worker2-eip", { domain: "vpc" });


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
    associatePublicIpAddress: false
});

const master1 = new aws.ec2.Instance("master1", {
    tags: { "Name": "master1" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(masterUserData).toString('base64'),              // start a simple web server
    associatePublicIpAddress: false
});

const master2 = new aws.ec2.Instance("master2", {
    tags: { "Name": "master2" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(masterUserData).toString('base64'),              // start a simple web server
    associatePublicIpAddress: false
});

const worker1 = new aws.ec2.Instance("worker1", {
    tags: { "Name": "worker1" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the group object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(workerUserData).toString('base64'),              // start a simple web server
    associatePublicIpAddress: false
});

const worker2 = new aws.ec2.Instance("worker2", {
    tags: { "Name": "worker2" },
    instanceType: aws.ec2.InstanceType.T3_Medium, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ k8sSecurityGroup.id ], // reference the k8sSecurityGroup object above
    ami: ami,
    subnetId: subnet.id,
    keyName: key,
    userData: Buffer.from(workerUserData).toString('base64'),              // start a simple web server
    associatePublicIpAddress: false
});

new aws.ec2.EipAssociation("Loadbalancer-eip-association", { allocationId: LoadbalancerEip.allocationId,  instanceId: loadbalancer.id, });
new aws.ec2.EipAssociation("Master1-eip-association", { allocationId: Master1Eip.allocationId,  instanceId: master1.id, });
new aws.ec2.EipAssociation("Master2-eip-association", { allocationId: Master2Eip.allocationId,  instanceId: master2.id, });
new aws.ec2.EipAssociation("Worker1-eip-association", { allocationId: Worker1Eip.allocationId,  instanceId: worker1.id, });
new aws.ec2.EipAssociation("Worker2-eip-association", { allocationId: Worker2Eip.allocationId,  instanceId: worker2.id, });

export const loadbalancerpublicIp = LoadbalancerEip.publicIp;
export const master1publicIp = Master1Eip.publicIp;
export const master2publicIp = Master2Eip.publicIp;
export const worker1publicIp = Worker1Eip.publicIp;
export const worker2publicIp = Worker2Eip.publicIp;

