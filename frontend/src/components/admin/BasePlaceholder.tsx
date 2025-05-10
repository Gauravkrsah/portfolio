
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface BasePlaceholderProps {
  title: string;
  description: string;
  addButtonText: string;
  onAddClick: () => void;
}

const BasePlaceholder: React.FC<BasePlaceholderProps> = ({
  title,
  description,
  addButtonText,
  onAddClick
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button onClick={onAddClick} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          {addButtonText}
        </Button>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-center text-muted-foreground">No items found</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-center text-sm text-muted-foreground mb-4">
            You haven't added any {title.toLowerCase()} yet. Click the button below to add your first one.
          </p>
          <Button variant="outline" onClick={onAddClick} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            {addButtonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasePlaceholder;
