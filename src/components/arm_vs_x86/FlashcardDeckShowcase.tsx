import SingleFlashcard from "./FlashcardDeck";
import { getFlashcard } from "./CategoryPage";
import { armData, x86Data } from "./data";

export default function FlashcardDeckShowcase() {
  const armCard = getFlashcard("overview", armData, "#00C2D1");
  const x86Card = getFlashcard("overview", x86Data, "#FF8C42");

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SingleFlashcard
          card={armCard}
          accentColor="#00C2D1"
          categoryLabel="Overview"
        />
        <SingleFlashcard
          card={x86Card}
          accentColor="#FF8C42"
          categoryLabel="Overview"
        />
      </div>
    </div>
  );
}
