interface InvestigationNotesProps {
  notes: string;
  setNotes: (val: string) => void;
}

export function InvestigationNotes({ notes, setNotes }: InvestigationNotesProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
          Initial Investigation Notes
        </h3>
      </div>
      
      <textarea
        className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px] resize-y"
        placeholder="Add observations or initial findings..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
    </div>
  );
}
