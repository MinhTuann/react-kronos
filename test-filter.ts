import { publicApi } from './src/lib/api';

async function test() {
  const brands = await publicApi.getBrands();
  const collections = await publicApi.getCollections();
  const watches = await publicApi.getWatches();

  console.log("Brands:");
  console.log(brands);
  console.log("Watches:");
  console.log(watches);
}

test();
