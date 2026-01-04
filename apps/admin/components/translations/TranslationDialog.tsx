'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TranslationTabs } from './TranslationTabs';

interface TranslationField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'array';
  required?: boolean;
  placeholder?: string;
}

interface TranslationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: 'tours' | 'blog' | 'categories' | 'blog-categories' | 'cities' | 'itinerary' | 'tour-faq';
  entityId: string;
  entityName: string;
  fields: TranslationField[];
  onSaveSuccess?: () => void;
}

export function TranslationDialog({
  open,
  onOpenChange,
  entityType,
  entityId,
  entityName,
  fields,
  onSaveSuccess,
}: TranslationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Translations</DialogTitle>
          <DialogDescription>
            Manage translations for {entityName} in different languages
          </DialogDescription>
        </DialogHeader>

        <TranslationTabs
          entityType={entityType}
          entityId={entityId}
          fields={fields}
          onSaveSuccess={onSaveSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
