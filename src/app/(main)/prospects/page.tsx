import { prospects } from '@/lib/data';
import { ProspectsTable } from './components/prospects-table';
import { AddProspectDialog } from './components/add-prospect-dialog';

export default function ProspectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Prospects</h1>
        <div className="ml-auto flex items-center gap-2">
          <AddProspectDialog />
        </div>
      </div>
      <ProspectsTable data={prospects} />
    </div>
  );
}
