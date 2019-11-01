## Scrypta IdaNode: 
# Raspberry Pi 4 Setup

### Linux Kali 4.19.66-Re4son-v8l+
I'm moving from Rasbian to Kali due to the need for a 64-bit system for mongodb, during the writing of this guide
the 64-bit version of Raspbian for Raspberry Pi 4 has not yet been released. Anyway let's start!

First of all, if it has not already been done you must install the wallet following the previous [guide](link-to-wallet-tutorial).

Run:

```
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 7BF576066ADA65728FC7E70A8C47BE8E75BCA694
```
And add in _etc/apt/sources.list_:

> deb http://<i></i>ppa.launchpad.net/certbot/certbot/ubuntu bionic main <br/>
> deb-src http://<i></i>ppa.launchpad.net/certbot/certbot/ubuntu bionic main 
 
Now you can:
```
cd
git clone https://github.com/scryptachain/scrypta-idanodejs
cd scrypta-idanodejs
chmod 777 install.sh
./install.sh
```

with _install.sh_:
```
#WRITING CONF FILE
echo "rpcuser=lyrarpc
rpcpassword=lyrapassword
rpcallowip=127.0.0.1
listen=1
server=1
daemon=1
index=1
txindex=1
logtimestamps=1" > "/root/.lyra/lyra.conf"

#INSTALL NODEJS
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install pm2 -g

#INSTALL MONGODB
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
mkdir mongodb_data

#RESTORE MONGODB BOOTSTRAP
wget https://scrypta.sfo2.digitaloceanspaces.com/mongo_bootstrap_191001.tar.gz
mongod --dbpath=./mongodb_data &
sleep 20s
tar -xvzf mongo_bootstrap_191001.tar.gz
sudo mongorestore --db idanodejs --drop idanodejs
rm -rf idanodejs
pkill mongod

#DOWNLOADING NODE MODULES
npm install
cp example.env .env

#UPDATING NPM
npm install -g npm

#SETTING UP NGINX
sudo apt update
sudo apt install nginx -y

#INSTALL CERTBOT
sudo apt install python-certbot-nginx -y

pm2 startup
echo "NOW EDIT .env FILE AND RUN FOLLOWING COMMAND:"
echo "pm2 start npm -- start && pm2 save"
```

Now set the same _rpcuser_ and _rpcpassword_  and lyrapath in:

### _scrypta-idanodejs/.env_

```
RPCUSER=my-username
RPCPASSWORD=my-password
RPCPORT=42223
RPCADDRESS=localhost
LYRAPATH=my-lyrad-path #~/scrypta/src
```

and in:

### _.lyra/lyra.conf_

```
rpcuser=my-username
rpcpassword=my-password
```

Well, now we can start Scrypta IdaNode:
```
cd ~/scrypta-idanodejs
npm run dev
```
 and the synchronization start!
 
 Verify with http://localhost:3001/wallet/getinfo that everything is working properly.

