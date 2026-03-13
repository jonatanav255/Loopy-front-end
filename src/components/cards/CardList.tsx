import type { CardResponse, SchedulingAlgorithm } from '../../types/card';
import { CardItem } from './CardItem';

interface CardListProps {
  cards: CardResponse[];
  onEdit: (card: CardResponse) => void;
  onDelete: (card: CardResponse) => void;
  onSwitchAlgorithm: (id: string, algorithm: SchedulingAlgorithm) => Promise<void>;
}

export function CardList({ cards, onEdit, onDelete, onSwitchAlgorithm }: CardListProps) {
  return (
    <div className="space-y-3">
      {cards.map(card => (
        <CardItem
          key={card.id}
          card={card}
          onEdit={() => onEdit(card)}
          onDelete={() => onDelete(card)}
          onSwitchAlgorithm={alg => onSwitchAlgorithm(card.id, alg)}
        />
      ))}
    </div>
  );
}
