
const apiOpts = {};

async function mintNft() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");


    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    let ethereum = window.ethereum;
    let chainId = window.ethereum.chainId;


    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
    console.log(ethereum)
    console.log(chainId);

    const minter = new videonft.minter.FullMinter(apiOpts, { ethereum, chainId });

    console.log(minter);
    let file = document.getElementById('file').files[0];
    let title = document.getElementById("title").value || "My NFT";
    console.log(title)
    console.log(file)
    let asset = await minter.api.createAsset(title, file);
    console.log(asset);
    // // optional, optimizes the video for the NFT
    asset = await minter.api.nftNormalize(asset);
    console.log(asset)
    const nftMetadata = {
        description: 'My NFT description',
        traits: { 'my-custom-trait': 'my-custom-value' }
    };
    console.log(nftMetadata)

    const nftInfo = await minter.createNft({
        name: 'My NFT',
        file,
        nftMetadata
    });
    console.log(`minted NFT on contract ${nftInfo.contractAddress} with ID ${nftInfo.tokenId}`);
    return nftInfo;
}