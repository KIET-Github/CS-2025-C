import Pre from "@/components/markdown/pre";
import { cn } from "@/lib/utils";
import React, { ComponentProps, memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preProcess = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl.tagName !== "code") return;
      node.raw = codeEl.children?.[0].value;
      const meta = codeEl.data?.meta;
      if (meta && typeof meta === "string") {
        const fileMatch = meta.match(/title=([\w./-]+)/);
        if (fileMatch) {
          node.filename = fileMatch[1];
        }
      }
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postProcess = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      node.properties["raw"] = node.raw;
      node.properties["filename"] = node.filename;
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeLanguage = () => (tree: any) => {
  const supported = new Set([
    "js",
    "ts",
    "tsx",
    "jsx",
    "html",
    "css",
    "json",
    "bash",
    "python",
    "c",
    "cpp",
    "java",
  ]);

  visit(tree, "element", (node) => {
    if (node.tagName === "code" && node.properties?.className) {
      const classNames = node.properties.className;
      const langClass = classNames.find((c: string) =>
        c.startsWith("language-")
      );

      if (langClass) {
        const lang = langClass.replace("language-", "");
        if (!supported.has(lang)) {
          // fallback to plain text if unsupported
          node.properties.className = ["language-text"];
        }
      }
    }
  });
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={cn("font-heading text-4xl ", className)} {...props} />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn("font-heading text-3xl font-medium  w-fit", className)}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className={cn("font-heading text-lg w-fit", className)} {...props} />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className={cn("font-heading text-lg ", className)} {...props} />
    ),
    h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5 className={cn("scroll-m-20 text-lg ", className)} {...props} />
    ),
    h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6 className={cn(" text-base", className)} {...props} />
    ),
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong
        className={cn("font-normal inline text-cyan-400", className)}
        {...props}
      />
    ),
    em: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <em className={cn("not-italic", className)} {...props} />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn("ml-3 py-0  my-0", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={cn("list-decimal ml-6", className)} {...props} />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={cn("list-disc ml-6", className)} {...props} />
    ),
    a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={cn("font-medium underline underline-offset-4", className)}
        target="_blank"
        {...props}
      />
    ),
    p: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={cn(" py-0 m-0 font-thin", className)} {...props} />
    ),
    pre: Pre,
    code: ({ className, children, ...props }: ComponentProps<"code">) => {
      return (
        <code
          className={`${className} text-sm  py-0.5 px-1 rounded  border`}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[preProcess, normalizeLanguage, rehypePrism, postProcess]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
