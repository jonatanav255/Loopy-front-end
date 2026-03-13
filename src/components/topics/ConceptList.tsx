// Dependencies: DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates — see DEPENDENCY_GUIDE.md
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import type { ConceptResponse } from '../../types/concept';
import { SortableConceptItem } from './SortableConceptItem';

interface ConceptListProps {
  topicId: string;
  concepts: ConceptResponse[];
  onEdit: (concept: ConceptResponse) => void;
  onDelete: (concept: ConceptResponse) => void;
  onReorder?: (orderedIds: string[]) => void;
}

export function ConceptList({ topicId, concepts, onEdit, onDelete, onReorder }: ConceptListProps) {
  const [items, setItems] = useState(concepts);

  useEffect(() => {
    setItems(concepts);
  }, [concepts]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(c => c.id === active.id);
    const newIndex = items.findIndex(c => c.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    onReorder?.(newItems.map(c => c.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((concept, index) => (
            <SortableConceptItem
              key={concept.id}
              topicId={topicId}
              concept={concept}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
