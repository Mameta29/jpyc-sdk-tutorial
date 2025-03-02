import { Uint256, Uint8 } from 'soltypes';
import { jpyc, account } from './index';
import { ethers } from 'ethers';

async function main() {
  try {
    // 許可を与える先のアドレス（スマートコントラクトや取引所のアドレスなど）
    const spenderAddress = '0xb4814B09A70F877F6200dc3e85078fAb972132D0';  // Sepoliaのテストアドレス

    // 許可前の許可額を確認
    const allowanceBefore = await jpyc.allowance({
      owner: account.address,
      spender: spenderAddress,
    });
    console.log(`Allowance before permit: ${allowanceBefore.toString()}`);

    // permitのパラメータを設定
    const owner = account.address;
    const value = Uint256.from('1000');  // 1000 JPYCの使用を許可
    const deadline = Uint256.from(
      Math.floor(Date.now() / 1000 + 3600).toString()  // 1時間後
    );

    // 現在のnonce値を取得
    const nonce = await jpyc.nonces({
      owner: owner,
    });
    console.log(`Current nonce: ${nonce.toString()}`);

    // メッセージのハッシュ化と署名
    // Note: 実際の実装では、適切なドメインセパレータとタイプハッシュを使用する必要があります
    const message = ethers.solidityPacked(
      ['address', 'address', 'uint256', 'uint256', 'uint256'],
      [owner, spenderAddress, value, deadline, nonce]
    );
    const messageHash = ethers.keccak256(message);
    
    // 署名の生成
    const signature = await account.signMessage(ethers.getBytes(messageHash));
    const { v, r, s } = ethers.Signature.from(signature);

    // permitトランザクションの実行
    const txHash = await jpyc.permit({
      owner: owner,
      spender: spenderAddress,
      value: value,
      deadline: deadline,
      v: Uint8.from(v),
      r: r,
      s: s,
    });

    console.log(`Permit transaction: https://sepolia.etherscan.io/tx/${txHash}`);

    // トランザクションの完了を待つ
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 許可後の許可額を確認
    const allowanceAfter = await jpyc.allowance({
      owner: owner,
      spender: spenderAddress,
    });
    console.log(`Allowance after permit: ${allowanceAfter.toString()}`);

    // 新しいnonce値を確認
    const newNonce = await jpyc.nonces({
      owner: owner,
    });
    console.log(`New nonce: ${newNonce.toString()}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();