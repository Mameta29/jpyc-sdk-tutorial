import { Uint256 } from 'soltypes';
import { jpyc, account } from './index';

async function main() {
  try {
    // 許可を与える先のアドレス（スマートコントラクトや取引所のアドレスなど）
    const spenderAddress = '0xb4814B09A70F877F6200dc3e85078fAb972132D0';  // Sepoliaのテストアドレス

    // 承認前の許可額を確認
    const allowanceBefore = await jpyc.allowance({
      owner: account.address,
      spender: spenderAddress,
    });
    console.log(`Allowance before approval: ${allowanceBefore.toString()}`);

    // 1000 JPYCの使用を許可
    const approveAmount = Uint256.from('1000');
    const txHash = await jpyc.approve({
      spender: spenderAddress,
      value: approveAmount,
    });

    console.log(`Approval transaction: https://sepolia.etherscan.io/tx/${txHash}`);

    // トランザクションの完了を待つ（実際の実装では適切な待機処理を追加することを推奨）
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 承認後の許可額を確認
    const allowanceAfter = await jpyc.allowance({
      owner: account.address,
      spender: spenderAddress,
    });
    console.log(`Allowance after approval: ${allowanceAfter.toString()}`);

    // 許可額の増加
    const incrementAmount = Uint256.from('500');
    const increaseTxHash = await jpyc.increaseAllowance({
      spender: spenderAddress,
      increment: incrementAmount,
    });
    
    console.log(`Increase allowance transaction: https://sepolia.etherscan.io/tx/${increaseTxHash}`);

    // 最終的な許可額を確認
    const finalAllowance = await jpyc.allowance({
      owner: account.address,
      spender: spenderAddress,
    });
    console.log(`Final allowance: ${finalAllowance.toString()}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();