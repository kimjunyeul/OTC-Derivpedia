'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

interface Props {
  content: string;
}

export default function MarkdownSection({ content }: Props) {
  return (
    <div className="prose prose-slate max-w-none
      prose-headings:font-bold prose-headings:text-primary
      prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
      prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-primary/80
      prose-p:text-slate-700 prose-p:leading-relaxed
      prose-strong:text-slate-800
      prose-table:text-sm
      prose-th:bg-slate-50 prose-th:text-primary prose-th:font-semibold prose-th:px-3 prose-th:py-2
      prose-td:px-3 prose-td:py-2 prose-td:border-slate-200
      prose-code:text-[13px] prose-code:bg-amber-50 prose-code:px-1 prose-code:rounded prose-code:text-slate-800
      prose-pre:bg-amber-50 prose-pre:text-slate-800 prose-pre:text-[13px] prose-pre:border prose-pre:border-amber-200
      prose-li:text-slate-700
      prose-blockquote:border-accent prose-blockquote:text-slate-600
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
