const anchor = require('@project-serum/anchor')

const { setProvider, Provider, workspace, web3 } = anchor
const { SystemProgram, Keypair } = web3

const GIF_LINK = 'https://media.giphy.com/media/HtqFbL7el09oY/giphy.gif'

const main = async () => {
  console.log('🚀 Starting test...')

  const provider = Provider.env()
  setProvider(provider)
  
  const program = workspace.Myepicproject

  // Create an account keypair for our program to use.
  const baseAccount = Keypair.generate()

  const params = {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount]
  }
  const tx = await program.rpc.startStuffOff(params)

  console.log('📝 Your transaction signature: ', tx)

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log('👀 GIF Count: ', account.totalGifs.toString())

  const gifParams = {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    }
  }
  await program.rpc.addGif(GIF_LINK, gifParams)

  // Fetch data from the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log('[UPDATED] 👀 GIF Count: ', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('👀 GIF List: ', account.gifList)

  const gifToUpdate = account.gifList.at(-1)

  await program.rpc.updateGif(gifToUpdate.gifLink, gifParams)

  // Fetch data from the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log('[UPDATED THE VOTES] 👀 GIF Count: ', account.gifList)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error('Error run main: ', error)
    process.exit(1)
  }
}

runMain()