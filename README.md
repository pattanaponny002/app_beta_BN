# app_beta_BN
This is for testing deploying the transcript version as backended server-site
and process.env.PORT === 4000 ??

 "scripts": {
    "start": "node index.js",
    "start:dev": "nodemon index.js"
  },
  "engines": {
    "node": "20.x"
  },



sudo yum update -y
sudo yum install -y gcc-c++ make
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 20.6.1

node -v
[1]
npm install -g yarn
yarn --version

[2]

curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo yum install yarn
sudo yum install yarn --without nodejs

sudo yum install systemd


sudo nano /etc/systemd/system/node.service

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


sudo systemctl start/status/enable/disable/stop nodeapp.service
