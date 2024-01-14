// Copyright 2016-2021, Pulumi Corporation.  All rights reserved.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Get the id for the latest Amazon Linux AMI
const ami = "ami-098940df4d3292e9a"
const key = "Window2"

// Create a security group
const mySecurityGroup = new aws.ec2.SecurityGroup("my-security-group", {
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
// (optional) create a simple web server using the startup script for the instance
// Create a FileAsset for your user data script
const masterUserData = new pulumi.asset.FileAsset("../../scripts/master.sh");
const workerUserData = new pulumi.asset.FileAsset("../../scripts/worker.sh");

const loadbalancer = new aws.ec2.Instance("loadbalancer", {
    tags: { "Name": "loadbalancer" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ group.id ], // reference the group object above
    ami: ami,
    keyName: key,
});

const master1 = new aws.ec2.Instance("master1", {
    tags: { "Name": "master1" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ group.id ], // reference the group object above
    ami: ami,
    keyName: key,
    userData: masterUserData ,              // start a simple web server
});

const master2 = new aws.ec2.Instance("master2", {
    tags: { "Name": "master2" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ group.id ], // reference the group object above
    ami: ami,
    keyName: key,
    userData: masterUserData ,              // start a simple web server
});

const worker1 = new aws.ec2.Instance("worker1", {
    tags: { "Name": "worker1" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ group.id ], // reference the group object above
    ami: ami,
    keyName: key,
    userData: workerUserData ,              // start a simple web server
});

const worker2 = new aws.ec2.Instance("worker2", {
    tags: { "Name": "worker2" },
    instanceType: aws.ec2.InstanceType.T2_Micro, // t2.micro is available in the AWS free tier
    vpcSecurityGroupIds: [ group.id ], // reference the group object above
    ami: ami,
    keyName: key,
    userData: workerUserData ,              // start a simple web server
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
