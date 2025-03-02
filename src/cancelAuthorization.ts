import { Uint8 } from 'soltypes';
import { jpyc, account } from './index';
import { ethers } from 'ethers';

async function main() {
  try {
    // 認可を取り消すアドレス（この例では自分のアドレス）
    const authorizerAddress = account.address;

    // ランダムなnonceの生成（実際の実装では、取り消したい認可のnonceを使用）
    const nonce = ethers.randomBytes(32);

    // キャンセルメッセージのハッシュ化と署名
    // Note: 実際の実装では、適切なドメインセパレータとタイプハッシュを使用する必要があります
    const message = ethers.solidityPacked(
      ['address', 'bytes32'],
      [authorizerAddress, nonce]
    );
    const messageHash = ethers.keccak256(message);
    
    // 署名の生成
    const signature = await account.signMessage(ethers.getBytes(messageHash));
    const { v, r, s } = ethers.Signature.from(signature);

    // 認可のキャンセル実行
    const txHash = await jpyc.cancelAuthorization({
      authorizer: authorizerAddress,
      nonce: nonce,
      v: Uint8.from(v),
      r: r,
      s: s,
    });

    console.log(`Cancel authorization transaction: https://sepolia.etherscan.io/tx/${txHash}`);

    // トランザクションの完了を待つ
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Authorization successfully cancelled');

    // キャンセル後に同じnonceで認可されたトランザクションを実行しようとすると失敗します
    // 実際の実装では、ここで認可が本当にキャンセルされたことを確認するためのテストを追加することを推奨

  } catch (error) {
    console.error('Error:', error);
  }
}

main();