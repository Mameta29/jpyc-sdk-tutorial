import { ChainName, Endpoint, NetworkName } from '@jpyc/sdk-core';
import { IJPYC, ISdkClient, JPYC, SdkClient } from '@jpyc/sdk-v1';
import dotenv from 'dotenv';

dotenv.config();

// SDKのセットアップ
const sdkClient: ISdkClient = new SdkClient({
  chainName: process.env.CHAIN_NAME as ChainName,
  networkName: process.env.NETWORK_NAME as NetworkName,
  rpcEndpoint: process.env.RPC_ENDPOINT as Endpoint,
});

// アカウントの生成（自分のアカウント）
export const account = sdkClient.createPrivateKeyAccount({});

// クライアントの生成
export const client = sdkClient.createLocalClient({
  account: account,
});

// JPYC SDKインスタンスの初期化
export const jpyc: IJPYC = new JPYC({
  client: client,
});