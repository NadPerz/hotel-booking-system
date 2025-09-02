import { Injectable } from '@nestjs/common';
import { Conversation } from 'src/itinerary/domain/entities/conversation.entity';
import {
  UpdateContextUseCase,
  HandleClarificationUseCase,
  CreateItineraryUseCase,
  ModifyItineraryUseCase,
} from '../use-cases/itinerary-generation';
import { ConversationContext } from 'src/itinerary/domain/value-objects/conversation';

@Injectable()
export class ItineraryChatService {
  private conversations = new Map<string, Conversation>();

  constructor(
    private readonly updateContextUseCase: UpdateContextUseCase,
    private readonly handleClarificationUseCase: HandleClarificationUseCase,
    private readonly createItineraryUseCase: CreateItineraryUseCase,
    private readonly modifyItineraryUseCase: ModifyItineraryUseCase,
  ) {}

  async chatItinerary(message: string, conversationId: string) {
    let conversation = this.conversations.get(conversationId);
    if (!conversation) {
      conversation = new Conversation(conversationId);
    }

    conversation.addMessage('user', message);
    console.log(message);

    await this.updateContextUseCase.execute(message, conversation);
    console.log(conversation.getContext());
    let response: string = '';

    switch (conversation.getContext().stage) {
      case 'initial':
        response = this.handleInitialPrompt(message, conversation.getContext());
        break;
      case 'clarifying':
        response = this.handleClarificationUseCase.execute(
          conversation.getContext(),
        );
        break;
      case 'creating': {
        const createResult = await this.createItineraryUseCase.execute(
          conversation.getContext(),
        );

        console.log(createResult);

        conversation.updateContext({
          currentItinerary: createResult.itinerary,
          stage: 'modifying',
        });

        console.log(conversation);
        response = createResult.response;
        break;
      }

      case 'modifying': {
        const modifyResult = await this.modifyItineraryUseCase.execute(
          message,
          conversation.getContext().currentItinerary!,
          conversation.getContext(),
        );
        conversation.updateContext({
          currentItinerary: modifyResult.itinerary,
        });
        response = modifyResult.response;
        break;
      }
    }

    conversation.addMessage('assistant', response);
    this.conversations.set(conversationId, conversation);

    return { response, context: conversation.getContext() };
  }

  private handleInitialPrompt(
    message: string,
    context: ConversationContext,
  ): string {
    if (!context.destination) {
      return "I'd love to help you plan your trip! Where would you like to travel?";
    }
    return this.handleClarificationUseCase.execute(context);
  }
}
