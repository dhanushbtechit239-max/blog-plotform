export const parseMarkdown = (text) => {
  if (!text) return '';
  
  // Escape HTML to prevent XSS (except allowed tags we generate)
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Code blocks (multiline) - handle this first before heading blockquotes
  html = html.replace(/```([\s\S]*?)```/gm, (match, code) => {
    return `<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs my-4 overflow-x-auto border border-white/5">${code.trim()}</pre>`;
  });
    
  html = html
    // Headings
    .replace(/^### (.*$)/gim, '<h4 class="text-base font-bold mt-4 mb-2 text-slate-100">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold mt-6 mb-3 text-slate-100">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 class="text-xl font-extrabold mt-8 mb-4 text-slate-100">$1</h2>')
    
    // Blockquotes
    .replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 italic my-4 text-slate-400">$1</blockquote>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-purple-400 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
    
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-100">$1</strong>')
    
    // Italics
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    
  // Paragraph split and wrap
  return html
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.match(/^<(h2|h3|h4|blockquote|pre|code)/)) return line;
      return `<p class="mb-4 leading-relaxed text-slate-300">${line}</p>`;
    })
    .join('\n');
};
