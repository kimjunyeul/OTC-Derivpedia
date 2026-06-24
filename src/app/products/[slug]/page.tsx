import { notFound } from 'next/navigation';
import { PRODUCT_MAP, ALL_PRODUCTS } from '@/content/products';
import ProductPage from '@/components/ProductPage';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCT_MAP.get(slug);
  if (!product) return {};
  return {
    title: `${product.name} (${product.fullName}) | 장외파생상품 백과사전`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCT_MAP.get(slug);
  if (!product) notFound();

  return <ProductPage product={product} />;
}
