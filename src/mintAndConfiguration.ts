import { Uint256 } from 'soltypes';
import { jpyc, account } from './index';

async function main() {
  try {
    // Minterとして設定するアドレス（この例では自分のアドレス）
    const minterAddress = account.address;

    // まず、アドレスがMinterかどうかを確認
    const isMinterBefore = await jpyc.isMinter({
      account: minterAddress,
    });
    console.log(`Is address minter before configuration: ${isMinterBefore}`);

    // 現在のMinter許可額を確認
    const minterAllowanceBefore = await jpyc.minterAllowance({
      minter: minterAddress,
    });
    console.log(`Minter allowance before configuration: ${minterAllowanceBefore.toString()}`);

    // Minterの設定（1,000,000 JPYCの発行権限を付与）
    const minterAmount = Uint256.from('1000000');
    const configTxHash = await jpyc.configureMinter({
      minter: minterAddress,
      minterAllowedAmount: minterAmount,
    });

    console.log(`Minter configuration transaction: https://sepolia.etherscan.io/tx/${configTxHash}`);

    // トランザクションの完了を待つ
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Minter設定後の確認
    const isMinterAfter = await jpyc.isMinter({
      account: minterAddress,
    });
    console.log(`Is address minter after configuration: ${isMinterAfter}`);

    const minterAllowanceAfter = await jpyc.minterAllowance({
      minter: minterAddress,
    });
    console.log(`Minter allowance after configuration: ${minterAllowanceAfter.toString()}`);

    // JPYCの発行
    if (isMinterAfter) {
      // 発行前の総供給量を確認
      const totalSupplyBefore = await jpyc.totalSupply();
      console.log(`Total supply before minting: ${totalSupplyBefore.toString()}`);

      // 1,000 JPYCを発行
      const mintAmount = Uint256.from('1000');
      const mintTxHash = await jpyc.mint({
        to: minterAddress,  // 自分のアドレスに発行
        amount: mintAmount,
      });

      console.log(`Minting transaction: https://sepolia.etherscan.io/tx/${mintTxHash}`);

      // トランザクションの完了を待つ
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 発行後の総供給量と残高を確認
      const totalSupplyAfter = await jpyc.totalSupply();
      console.log(`Total supply after minting: ${totalSupplyAfter.toString()}`);

      const balance = await jpyc.balanceOf({
        account: minterAddress,
      });
      console.log(`Minter balance after minting: ${balance.toString()}`);

      // 残りのMinter許可額を確認
      const remainingAllowance = await jpyc.minterAllowance({
        minter: minterAddress,
      });
      console.log(`Remaining minter allowance: ${remainingAllowance.toString()}`);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();