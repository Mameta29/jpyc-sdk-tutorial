import { jpyc } from './index';

async function main() {
  try {
    // 総供給量の取得
    const totalSupply = await jpyc.totalSupply();
    console.log(`Total Supply: ${totalSupply.toString()}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();