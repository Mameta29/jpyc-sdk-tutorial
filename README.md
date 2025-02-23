# JPYC SDK Tutorial

## 概要

このリポジトリでは、Sepolia テストネット上で JPYC トークンを操作するための基本的な実装例を紹介しています。Mainnet でも挙動は同じになるはずですので参考にされてください。

## 必要条件

- Node.js 私は v22 を使用しています。
- Sepolia テストネット用の ETH
- Alchemy や Infura で RPC URL を取得しておいてください。

## セットアップ

1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/jpyc-tutorial.git
cd jpyc-tutorial
```

2. 依存パッケージのインストール

```bash
npm install
```

3. 環境変数の設定
   `.env`ファイルを作成し、以下の内容を設定します：

```env
CHAIN_NAME="ethereum"
NETWORK_NAME="sepolia"
RPC_ENDPOINT="https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
PRIVATE_KEY="YOUR-PRIVATE-KEY"
```

## 使用方法

### 総供給量の確認

```bash
npx ts-node src/totalSupply.ts
```

### トークンの転送

```bash
npx ts-node src/transfer.ts
```

### 承認（Approve）の実行

```bash
npx ts-node src/approve.ts
```

## ディレクトリ構造

```
jpyc-tutorial/
├── src/
│   ├── index.ts          # SDKの初期化
│   ├── totalSupply.ts    # 総供給量確認
│   └── transfer.ts       # トークン転送
├── .env                  # 環境変数
├── package.json
├── tsconfig.json
└── README.md
```

## 注意点

- テスト用の SepoliaETH が必要です
- 秘密鍵は安全に管理してください
- `.env`ファイルは Git にコミットしないでください

## エラー対処

エラーが発生した場合は以下を確認してください：

1. Sepolia テストネット用の ETH が十分にあるか
2. 環境変数が正しく設定されているか
3. アドレスが正しく入力されているか
4. トークンの残高が十分にあるか

## 参考リンク

- [JPYC 公式リポジトリ](https://sepoliafaucet.com)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com)
- [Sepolia Etherscan](https://sepolia.etherscan.io)
