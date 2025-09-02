import { Itinerary } from '../../entities/itinerary.entity';

export type ConversationStage =
  | 'initial'
  | 'clarifying'
  | 'creating'
  | 'modifying';

export class ConversationContext {
  constructor(
    public readonly stage: ConversationStage,
    public readonly destination?: string,
    public readonly dates?: string,
    public readonly budget?: string,
    public readonly interests?: string[],
    public readonly travelers?: number,
    public readonly currentItinerary?: Itinerary,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.stage) {
      throw new Error('Stage is required');
    }
    if (
      this.travelers !== undefined &&
      (this.travelers < 1 || !Number.isInteger(this.travelers))
    ) {
      throw new Error('Travelers must be a positive integer');
    }
    if (this.interests && !Array.isArray(this.interests)) {
      throw new Error('Interests must be an array');
    }
  }

  /**
   * Does not update the conversation state , just returns a new  conversationContext
   */
  update(
    updates: Partial<Omit<ConversationContext, 'stage'>> & {
      stage?: ConversationStage;
    },
  ): ConversationContext {
    console.log('updating conversationContext - ', updates);

    return new ConversationContext(
      updates.stage ?? this.stage,
      updates.destination ?? this.destination,
      updates.dates ?? this.dates,
      updates.budget ?? this.budget,
      updates.interests ?? this.interests,
      updates.travelers ?? this.travelers,
      updates.currentItinerary ?? this.currentItinerary,
    );
  }

  hasEnoughInfo(): boolean {
    return !!this.destination && !!this.dates && !!this.travelers;
  }

  isModificationRequested(): boolean {
    return this.stage === 'modifying' && !!this.currentItinerary;
  }

  equals(other: ConversationContext): boolean {
    return (
      this.stage === other.stage &&
      this.destination === other.destination &&
      this.dates === other.dates &&
      this.budget === other.budget &&
      JSON.stringify(this.interests) === JSON.stringify(other.interests) &&
      this.travelers === other.travelers
    );
  }

  toString(): string {
    return JSON.stringify({
      stage: this.stage,
      destination: this.destination,
      dates: this.dates,
      budget: this.budget,
      interests: this.interests,
      travelers: this.travelers,
      hasItinerary: !!this.currentItinerary,
    });
  }
}
