import { Uint256, Uint8 } from 'soltypes';
import { jpyc, account } from './index';
import { ethers } from 'ethers';

async function main() {
  try {
    // 送信元と送信先のアドレス
    const fromAddress = '0xb4814B09A70F877F6200dc3e85078fAb972132D0';  // 送信元のアドレス
    const toAddress = account.address;  // 受信者（自分）のアドレス

    // 受信前の残高確認
    const balanceBefore = await jpyc.balanceOf({
      account: toAddress,
    });
    console.log(`Receiver balance before: ${balanceBefore.toString()}`);

    // トランザクションパラメータの設定
    const transferAmount = Uint256.from('100');
    const now = Math.floor(Date.now() / 1000);
    const validAfter = Uint256.from(now.toString());
    const validBefore = Uint256.from((now + 3600).toString()); // 1時間後

    // ランダムなnonceの生成
    const nonce = ethers.randomBytes(32);

    // メッセージのハッシュ化と署名
    // Note: 実際の実装では、適切なドメインセパレータとタイプハッシュを使用する必要があります
    const message = ethers.solidityPacked(
      ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes32'],
      [fromAddress, toAddress, transferAmount, validAfter, validBefore, nonce]
    );
    const messageHash = ethers.keccak256(message);
    
    // 署名の生成（実際の実装では送信者が署名を生成）
    const signature = await account.signMessage(ethers.getBytes(messageHash));
    const { v, r, s } = ethers.Signature.from(signature);

    // receiveWithAuthorizationトランザクションの実行
    const txHash = await jpyc.receiveWithAuthorization({
      from: fromAddress,
      to: toAddress,
      value: transferAmount,
      validAfter: validAfter,
      validBefore: validBefore,
      nonce: nonce,
      v: Uint8.from(v),
      r: r,
      s: s,
    });

    console.log(`Receive with authorization transaction: https://sepolia.etherscan.io/tx/${txHash}`);

    // トランザクションの完了を待つ
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 受信後の残高確認
    const balanceAfter = await jpyc.balanceOf({
      account: toAddress,
    });
    console.log(`Receiver balance after: ${balanceAfter.toString()}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();