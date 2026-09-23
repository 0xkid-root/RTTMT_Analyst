import TransactionRiskMap from "@/features/command-center/components/TransactionRiskMap";

export default function MapTestPage() {
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col gap-6 text-foreground">
      <h1 className="text-2xl font-bold">RTTMT Transaction Risk Map</h1>
      <div className="w-full max-w-5xl mx-auto h-[600px]">
        <TransactionRiskMap className="w-full h-full min-h-[600px]" />
      </div>
    </div>
  );
}
