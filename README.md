# app_beta_BN
## This is for testing deploying the transcript version as backended server-site
### 1. ADD process.env.PORT === 4000 ?? and modified script

 "scripts": {
    "start": "node index.js",
    "start:dev": "nodemon index.js"
  },
  "engines": {
    "node": "20.x"
  },


### 2. install the gcc and package  adn update version
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 20.6.1



### 3. install yarn
node -v
[1]
npm install -g yarn
yarn --version

[2]

curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo yum install yarn
sudo yum install yarn --without nodejs

4. install systemd and modified service file
sudo yum install systemd

d
sudo nano /etc/systemd/system/node.service

### 5. create node.service
[Unit]
Description=Node.js App Service
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/app_beta_BN
ExecStart=/usr/bin/node /home/ec2-user/app_beta_BN/index.js
Restart=always

[Install]
WantedBy=multi-user.target

### 6. test flight node.service
sudo systemctl start/status/enable/disable/stop nodeapp.service
