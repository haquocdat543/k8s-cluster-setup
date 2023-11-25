# K8s cluster setup by hand on smartphone
This is a demonstration of k8s cluster setup by hand collaborate with AWS ( Amazon Web Services )
## Prerequisites
* A smartphone.
* A aws account
* Terminus
## Step 1. Login to AWS console and navigate to EC2
![step1](./numberized-images/1.jpg)
## step 2. Launch instaces ( t3.small at least and select your key pair )
![step2](./numberized-images/2.jpg)
## step 3. Select number of instance is 4
![step3](./numberized-images/3.jpg)
## step 4. Pass userdata to those instances
![step4](./numberized-images/4.jpg)
## step 5. Tap Launch instance button 
![step5](./numberized-images/5.jpg)
## step 6. Rename those instances ( M1, M2, W1, W2 )
![step6](./numberized-images/6.jpg)
## step 7. Continue launch an instance ( Loadbalancer )
![step7](./numberized-images/7.jpg)
## step 8. Instance type ( we can use t2.micro for Loadbalancer)
![step8](./numberized-images/8.jpg)
## step 9. Select number of instance is 1
![step9](./numberized-images/9.jpg)
## step 10. Pass userdata to Loadbalancer
![step10](./numberized-images/10.jpg)
## step 11. Get k8s nodes public ip addresses
![step11](./numberized-images/11.jpg)
## step 12. Get Loadbalancer public ip address 
![step12](./numberized-images/12.jpg)
## step 13. Get Termius
![step13](./numberized-images/13.jpg)
## step 14. Login to Loadbalancer
![step14](./numberized-images/14.jpg)
## step 15 Prepare scripts for Loadbalancer
![step15](./numberized-images/15.jpg)
## step 16. Execute previous scripts and some commands
![step16](./numberized-images/16.jpg)
## step 17. Copy first line of previous scripts
![step17](./numberized-images/17.jpg)
## step 18. Execute first line of previous scripts on M1
![step18](./numberized-images/18.jpg)
## step 19. Execute first line of previous scripts on M2
![step19](./numberized-images/19.jpg)
## step 20. Execute first line of previous scripts on W1
![step20](./numberized-images/20.jpg)
## step 21. Execute first line of previous scripts on W2
![step21](./numberized-images/21.jpg)
## step 22. Initialize control plane on M1
![step22](./numberized-images/22.jpg)
## step 23. Initialize successfully
![step23](./numberized-images/23.jpg)
## step 24. Copy kubeadm join command from M1 and execute in M2
![step24](./numberized-images/24.jpg)
## step 25. Join control plane successfully
![step25](./numberized-images/25.jpg)
## step 26. Copy a part of previous join command and execute on M1
![step26](./numberized-images/26.jpg)
## step 27. Copy a part of previous join command and execute on M2
![step27](./numberized-images/27.jpg)
## step 28. Run some commands in M1
![step28](./numberized-images/28.jpg)
## step 29. Run some commands in M2
![step29](./numberized-images/29.jpg)
## step 30. Apply calico
![step30](./numberized-images/30.jpg)
## step 31. Get nodes
![step31](./numberized-images/31.jpg)
## step 32. Waiting to get nodes
![step32](./numberized-images/32.jpg)
## step 33. Get nodes successfully in M1
![step33](./numberized-images/33.jpg)
## step 34. Get nodes successfully in M2
![step34](./numberized-images/34.jpg)
## step 35. Select insances to terminate
![step35](./numberized-images/35.jpg)
## step 36. Terminate successfully
![step36](./numberized-images/36.jpg)
