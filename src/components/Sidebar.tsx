'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Fuse from 'fuse.js';
import type { Product } from '@/types/product';
import { CATEGORY_NAMES, CATEGORY_ORDER } from '@/types/product';

interface Props {
  products: Product[];
}

export default function Sidebar({ products }: Props) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ['name', 'fullName', 'tags', 'categoryId'],
        threshold: 0.35,
      }),
    [products],
  );

  const filtered = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : null;

  const groupedProducts = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const p of (filtered ?? products)) map.get(p.categoryId)?.push(p);
    return map;
  }, [products, filtered]);

  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-200 bg-white h-full">
      {/* Search */}
      <div className="p-3 border-b border-slate-100">
        <div className="relative">
          <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="search"
            placeholder="상품 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {CATEGORY_ORDER.map((catId) => {
          const catProducts = groupedProducts.get(catId) ?? [];
          if (catProducts.length === 0) return null;

          const isCollapsed = collapsed.has(catId);
          return (
            <div key={catId}>
              <button
                onClick={() => toggleCategory(catId)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
              >
                <span>{CATEGORY_NAMES[catId]}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {!isCollapsed && (
                <ul className="mb-2">
                  {catProducts.map((product) => {
                    const isActive = pathname === `/products/${product.id}`;
                    return (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.id}`}
                          className={`
                            flex items-center gap-2 px-4 py-1.5 text-sm transition-colors
                            ${isActive
                              ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                          `}
                        >
                          <span className="font-mono text-xs font-bold text-slate-400 w-10 flex-shrink-0">
                            {product.name}
                          </span>
                          <span className="truncate text-xs">{product.fullName}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {filtered?.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-8">검색 결과 없음</p>
        )}
      </nav>
    </aside>
  );
}
