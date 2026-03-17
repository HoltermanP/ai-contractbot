import { DocumentUpload } from "@/components/admin/DocumentUpload";
import { DocumentList } from "@/components/admin/DocumentList";

export default async function AdminPage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Beheerpagina</h1>
          <p className="text-muted-foreground">
            Upload en beheer contractdocumenten die gebruikt worden voor vragen
          </p>
        </div>

        <DocumentUpload />
        <DocumentList />
      </div>
    </div>
  );
}

