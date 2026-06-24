import { redirect } from 'next/navigation';
import { ALL_PRODUCTS } from '@/content/products';

export default function Home() {
  if (ALL_PRODUCTS.length > 0) {
    redirect(`/products/${ALL_PRODUCTS[0].id}`);
  }
  return (
    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
      등록된 상품이 없습니다.
    </div>
  );
}
