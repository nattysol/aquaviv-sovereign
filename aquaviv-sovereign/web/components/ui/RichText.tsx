import { PortableText } from '@portabletext/react';
import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';

interface RichTextProps {
  content: any;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null;

  return (
    <div className={clsx(
      "prose prose-lg max-w-none", // 'prose' activates the plugin
      "prose-headings:font-bold prose-headings:text-primary prose-headings:tracking-tight",
      "prose-p:text-slate-600 prose-p:leading-relaxed",
      "prose-strong:text-slate-900 prose-strong:font-bold",
      "prose-li:text-slate-600 prose-li:marker:text-accent", // Custom bullet color
      "prose-a:text-accent prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
      "prose-blockquote:border-l-accent prose-blockquote:bg-surface-light prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-blockquote:rounded-r-lg",
      className
    )}>
      <PortableText 
        value={content} 
        components={{
          // Custom Overrides for specific blocks
          block: {
            h2: ({children}) => <h2 className="text-3xl md:text-4xl mt-12 mb-6 border-b border-slate-100 pb-4">{children}</h2>,
            h3: ({children}) => <h3 className="text-2xl mt-8 mb-4 text-slate-800">{children}</h3>,
          },
          // Custom List styling (optional, if prose-li above isn't enough)
          list: {
            bullet: ({children}) => <ul className="space-y-3 my-6 pl-4">{children}</ul>,
          },
          listItem: {
            bullet: ({children}) => (
              <li className="flex gap-3 items-start pl-0">
                <ArrowRight className="w-5 h-5 text-accent shrink-0 mt-1" />
                <span>{children}</span>
              </li>
            ),
          }
        }}
      />
    </div>
  );
}