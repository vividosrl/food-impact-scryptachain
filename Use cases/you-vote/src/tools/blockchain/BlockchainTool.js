export default async function createBlockchainTool(blockchainName) {
  let SelectedBlockchainTool = null;
  try {
    SelectedBlockchainTool = (
      await import("./" + blockchainName + "/" + blockchainName + ".js")
    ).default;
  } catch (error) {
    throw("Blockchain not supported");
  }
  return new SelectedBlockchainTool();
}
