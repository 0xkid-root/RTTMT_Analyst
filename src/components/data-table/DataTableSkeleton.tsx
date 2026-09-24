'use client';

export function DataTableSkeleton({ columns = 5, rows = 10 }: { columns?: number, rows?: number }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col flex-1 min-h-[500px]">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 font-medium">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="transition-colors">
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="px-4 py-3 whitespace-nowrap">
                    <div className="h-4 bg-muted/50 animate-pulse rounded w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
