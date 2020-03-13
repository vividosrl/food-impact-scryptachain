export default class IpfsClient {
  constructor(protocol = "http", host = "localhost", port = 5001) {
    this.ipfsClient = require("ipfs-http-client");
    this.ipfs = this.ipfsClient({
      host,
      port,
      protocol
    });
  }

  async addElection(election) {
    let result = await this.ipfs.add(election);
    return result[0].hash;
  }

  async getJson(ipfsHash) {
    var result = await this.ipfs.get(ipfsHash);
    return JSON.parse(result[0].content.toString("utf8"));
  }

  async getFolderContent(directory) {
    return await this.ipfs.ls(directory);
  }

  getIpfs() {
    return this.ipfs;
  }
}
