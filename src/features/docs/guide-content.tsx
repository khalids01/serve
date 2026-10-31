import { Children, isValidElement, type ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";
import { integrationGuide } from "./integration-guide";

function headingId(children: ReactNode) {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function GuideContent() {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 text-3xl font-semibold tracking-tight">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            id={headingId(children)}
            className="mb-4 mt-12 scroll-mt-24 border-t pt-8 text-2xl font-semibold tracking-tight"
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-3 mt-6 text-lg font-semibold">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="my-4 leading-7 text-muted-foreground">{children}</p>
        ),
        a: ({ children, href, title }) => (
          <a
            href={href}
            title={title}
            className="break-words text-primary underline underline-offset-4"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>
        ),
        table: ({ children }) => (
          <div className="my-6 max-w-full overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm [&_th]:border-b [&_th]:bg-muted [&_th]:p-3 [&_td]:border-b [&_td]:p-3 [&_td]:align-top">
              {children}
            </table>
          </div>
        ),
        code: ({ children }) => (
          <code className="rounded bg-muted px-1 font-mono text-[0.9em] [overflow-wrap:anywhere]">
            {children}
          </code>
        ),
        pre: ({ children }) => {
          const child = Children.toArray(children)[0];
          if (
            !isValidElement<{ children?: ReactNode; className?: string }>(child)
          )
            return <pre>{children}</pre>;
          return (
            <div className="my-5 min-w-0">
              <CodeBlock
                code={String(child.props.children ?? "").replace(/\n$/, "")}
                language={
                  child.props.className?.replace(/^language-/, "") ?? "text"
                }
              />
            </div>
          );
        },
      }}
    >
      {integrationGuide}
    </Markdown>
  );
}
