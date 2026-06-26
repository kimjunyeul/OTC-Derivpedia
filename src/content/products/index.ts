import type { Product, CategoryId } from '@/types/product';
import { CATEGORY_ORDER } from '@/types/product';
import { irs } from './irs';
import { fcn } from './fcn';
import { ccpBasisSwap } from './ccp-basis-swap';
import { boxSwap } from './box-swap';
import { elsStepdownLizard } from './els-stepdown-lizard';
import { ccaSwap } from './cca-swap';
import { singleRangeAccrualDlb } from './single-range-accrual-dlb';
import { cashSettledBondForward } from './cash-settled-bond-forward';
import { shareBasketSwap } from './share-basket-swap';
import { shareSwapLvo } from './share-swap-lvo';
import { creditIndexBasisSwap } from './credit-index-basis-swap';
import { elbHighFiveMonthly } from './elb-high-five-monthly';
import { callableZeroCouponSwap } from './callable-zero-coupon-swap';
import { cdsSkHynix } from './cds-sk-hynix';
import { americanOption } from './american-option';
import { digitalCompoundDlb } from './digital-compound-dlb';
import { powerSpread } from './power-spread';
import { longShortElb } from './long-short-elb';
import { cpDummyOptionDlb } from './cp-dummy-option-dlb';

export const ALL_PRODUCTS: Product[] = [
  irs,
  ccpBasisSwap,
  fcn,
  boxSwap,
  elsStepdownLizard,
  ccaSwap,
  singleRangeAccrualDlb,
  digitalCompoundDlb,
  cashSettledBondForward,
  shareBasketSwap,
  shareSwapLvo,
  creditIndexBasisSwap,
  elbHighFiveMonthly,
  callableZeroCouponSwap,
  cdsSkHynix,
  americanOption,
  powerSpread,
  longShortElb,
  cpDummyOptionDlb,
  // 추가 상품은 아래에 import 후 등록
];

export const PRODUCT_MAP = new Map<string, Product>(
  ALL_PRODUCTS.map((p) => [p.id, p]),
);

export function getProductsByCategory(): Map<CategoryId, Product[]> {
  const map = new Map<CategoryId, Product[]>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }
  for (const p of ALL_PRODUCTS) {
    map.get(p.categoryId)?.push(p);
  }
  return map;
}
