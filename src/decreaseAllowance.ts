import { Uint256 } from 'soltypes';
import { jpyc, account } from './index';

async function main() {
  try {
    // 許可を減少させるアドレス
    const spenderAddress = '0xb4814B09A70F877F6200dc3e85078fAb972132D0';  // Sepoliaのテストアドレス

    // 現在の許可額を確認
    const allowanceBefore = await jpyc.allowance({
      owner: account.address,
      spender: spenderAddress,
    });
    console.log(`Current allowance: ${allowanceBefore.toString()}`);

    // 許可額がゼロの場合は、まず許可を設定
    if (allowanceBefore.eq(Uint256.from('0'))) {
      const approveTxHash = await jpyc.approve({
        spender: spenderAddress,
        value: Uint256.from('1000'),  // 1000 JPYCの使用を許可
      });
      console.log(`Approval transaction: https://sepolia.etherscan.io/tx/${approveTxHash}`);

      // トランザクションの完了を待つ
      await new Promise(resolve => setTimeout(resolve, 5000));

      const newAllowance = await jpyc.allowance({
        owner: account.address,
        spender: spenderAddress,
      });
      console.log(`New allowance after approval: ${newAllowance.toString()}`);
    }

    // 許可額を300 JPYC減少
    const decrementAmount = Uint256.from('300');
    const txHash = await jpyc.decreaseAllowance({
      spender: spenderAddress,
      decrement: decrementAmount,
    });

    console.log(`Decrease allowance transaction: https://sepolia.etherscan.io/tx/${txHash}`);

    // トランザクションの完了を待つ
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 減少後の許可額を確認
    const allowanceAfter = await jpyc.allowance({
      owner: account.address,
      spender: spenderAddress,
    });
    console.log(`Allowance after decrease: ${allowanceAfter.toString()}`);

    // 実際の減少額を計算
    const actualDecrease = allowanceBefore.sub(allowanceAfter);
    console.log(`Actual decrease amount: ${actualDecrease.toString()}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();