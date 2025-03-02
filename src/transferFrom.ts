import { Uint256 } from 'soltypes';
import { jpyc, account } from './index';

async function main() {
  try {
    // 送金元と送金先のアドレス
    const fromAddress = '0xb4814B09A70F877F6200dc3e85078fAb972132D0';  // 送金元のアドレス（approve実行者）
    const toAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';  // 送金先のアドレス
    const spenderAddress = account.address;  // 送金実行者（自分）のアドレス

    // 送金前の残高確認
    const fromBalanceBefore = await jpyc.balanceOf({
      account: fromAddress,
    });
    console.log(`From address balance before transfer: ${fromBalanceBefore.toString()}`);

    const toBalanceBefore = await jpyc.balanceOf({
      account: toAddress,
    });
    console.log(`To address balance before transfer: ${toBalanceBefore.toString()}`);

    // 現在の許可額を確認
    const allowanceBefore = await jpyc.allowance({
      owner: fromAddress,
      spender: spenderAddress,
    });
    console.log(`Current allowance: ${allowanceBefore.toString()}`);

    // 送金したい額
    const transferAmount = Uint256.from('100');

    // 許可額が不足している場合は、approveを実行
    // 注: 実際のシナリオでは、このapproveは送金元アドレスの所有者が実行する必要があります
    if (allowanceBefore.lt(transferAmount)) {
      console.log('Insufficient allowance. Executing approve...');
      
      // このサンプルコードでは、送金元アドレスが自分のものであると仮定しています
      // 実際のアプリケーションでは、送金元アドレスの所有者に許可を要求する必要があります
      const approveTxHash = await jpyc.approve({
        spender: spenderAddress,
        value: transferAmount,
      });

      console.log(`Approve transaction: https://sepolia.etherscan.io/tx/${approveTxHash}`);

      // approveトランザクションの完了を待つ
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 許可額が正しく設定されたか確認
      const newAllowance = await jpyc.allowance({
        owner: fromAddress,
        spender: spenderAddress,
      });
      console.log(`New allowance after approval: ${newAllowance.toString()}`);

      if (newAllowance.lt(transferAmount)) {
        throw new Error('Approval failed or insufficient allowance');
      }
    }

    // transferFromの実行
    const txHash = await jpyc.transferFrom({
      from: fromAddress,
      to: toAddress,
      value: transferAmount,
    });

    console.log(`TransferFrom transaction: https://sepolia.etherscan.io/tx/${txHash}`);

    // トランザクションの完了を待つ
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 送金後の残高確認
    const fromBalanceAfter = await jpyc.balanceOf({
      account: fromAddress,
    });
    console.log(`From address balance after transfer: ${fromBalanceAfter.toString()}`);

    const toBalanceAfter = await jpyc.balanceOf({
      account: toAddress,
    });
    console.log(`To address balance after transfer: ${toBalanceAfter.toString()}`);

    // 送金後の許可額を確認
    const allowanceAfter = await jpyc.allowance({
      owner: fromAddress,
      spender: spenderAddress,
    });
    console.log(`Remaining allowance: ${allowanceAfter.toString()}`);

    // 実際の送金額と許可額の減少を確認
    const actualTransfer = toBalanceAfter.sub(toBalanceBefore);
    console.log(`Actual transfer amount: ${actualTransfer.toString()}`);

    const allowanceDecrease = allowanceBefore.sub(allowanceAfter);
    console.log(`Allowance decrease: ${allowanceDecrease.toString()}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();