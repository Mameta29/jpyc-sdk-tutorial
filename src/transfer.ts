import { Uint256 } from 'soltypes';
import { jpyc } from './index';

async function main() {
  try {
    // 送信先アドレス（ここは実際の送信先アドレスに置き換えてください）
    const receiverAddress = '0xb4814B09A70F877F6200dc3e85078fAb972132D0';  // Sepoliaのテストアドレス

    // 送信前の残高確認
    const balanceBefore = await jpyc.balanceOf({
        account: receiverAddress,
      });
      console.log(`Receiver balance before transfer: ${balanceBefore.toString()}`);

    // 100 JPYCを送信
    const txHash = await jpyc.transfer({
      to: receiverAddress,
      value: Uint256.from('100'),
    });

    console.log(`Explorer URL: https://sepolia.etherscan.io/tx/${txHash}`);

    // 送信後の残高確認
    const balanceAfter = await jpyc.balanceOf({
        account: receiverAddress,
      });
    console.log(`Receiver balance after transfer: ${balanceAfter.toString()}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();