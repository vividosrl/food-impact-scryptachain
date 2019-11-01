## Scrypta wallet: 
# Raspberry Pi 4 Setup

### Raspbian GNU/Linux 10 (buster)

```
sudo apt-get install -y software-properties-common
```
Then to add bitcoin and libssl1.0-dev PPA:
```
apt-get install debian-keyring debian-archive-keyring
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C70EF1F0305A1ADB9986DBD8D46F45428842CE5E
```
You can find Bitcoin Fingerprint in [Bitcoin - Stable Channel](https://launchpad.net/~bitcoin/+archive/ubuntu/bitcoin)

So add in _etc/apt/sources.list_:
> deb http://<i></i>ppa.launchpad.net/bitcoin/bitcoin/ubuntu bionic main <br/>
> deb-src http://<i></i>ppa.launchpad.net/bitcoin/bitcoin/ubuntu bionic main <br/>
> deb http://<i></i>security.debian.org/debian-security stretch/updates main 

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install libdb4.8-dev libdb4.8++-dev -y
sudo apt-get -y install build-essential autoconf automake libboost-all-dev libleveldb-dev libgmp-dev libgmp3-dev libssl-dev libcurl4-openssl-dev libcrypto++-dev libqrencode-dev libminiupnpc-dev autogen libtool git libevent-dev libprotobuf-dev
sudo apt-get install -y curl g++ git-core pkg-config libtool faketime bsdmainutils mingw-w64 g++-mingw-w64 nsis zip ca-certificates python
sudo apt-get install libzmq3-dev
sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler
sudo apt-get install libqrencode-dev
sudo apt install libssl1.0-dev
git clone https://github.com/scryptachain/scrypta
```
Now the dependencies are satisfied.

We can build and install Scrypta wallet:
```
cd scrypta
./autogen.sh
./configure
sudo make
```

Take a coffee...

...and another...

...and another...

```
cd src/qt
chmod 777 -R *
./lyra-qt
```

That's it!
