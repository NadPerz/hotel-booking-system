import { Injectable } from '@nestjs/common';
import { Conversation } from 'src/itinerary/domain/entities/conversation.entity';
import {
  UpdateContextUseCase,
  HandleClarificationUseCase,
  CreateItineraryUseCase,
  // ModifyItineraryUseCase,
} from '../use-cases/itinerary-generation';

@Injectable()
export class ItineraryChatService {
  private conversations = new Map<string, Conversation>();

  constructor(
    private readonly updateContextUseCase: UpdateContextUseCase,
    private readonly handleClarificationUseCase: HandleClarificationUseCase,
    private readonly createItineraryUseCase: CreateItineraryUseCase,
    // private readonly modifyItineraryUseCase: ModifyItineraryUseCase,
  ) {}

  async chatItinerary(message: string, conversationId: string) {
    let conversation = this.conversations.get(conversationId);
    if (!conversation) {
      conversation = new Conversation(conversationId);
    }

    conversation.addMessage('user', message);
    console.log(message);

    // Update context
    conversation.context = await this.updateContextUseCase.execute(
      message,
      conversation.context,
    );
    console.log(conversation.context);
    let response: string = '';

    switch (conversation.context.stage) {
      case 'initial':
        response = await this.handleInitialPrompt(
          message,
          conversation.context,
        );
        break;
      case 'clarifying':
        response = this.handleClarificationUseCase.execute(
          conversation.context,
        );
        break;
      case 'creating':
        // const createResult = await this.createItineraryUseCase.execute(
        //   conversation.context,
        // );
        // conversation.context.currentItinerary = createResult.itinerary;
        // conversation.context.stage = 'modifying';
        // response = createResult.response;
        break;
      case 'modifying':
        // const modifyResult = await this.modifyItineraryUseCase.execute(
        //   message,
        //   conversation.context.currentItinerary,
        //   conversation.context,
        // );
        // conversation.context.currentItinerary = modifyResult.itinerary;
        // response = modifyResult.response;
        break;
    }

    conversation.messages.push({ role: 'assistant', content: response });
    this.conversations.set(conversationId, conversation);

    return { response, context: conversation.context };
  }

  private async handleInitialPrompt(
    message: string,
    context: any,
  ): Promise<string> {
    if (!context.destination) {
      return "I'd love to help you plan your trip! Where would you like to travel?";
    }
    return this.handleClarificationUseCase.execute(context);
  }

  private formatItinerary(itinerary: any): string {
    // Formatting logic remains here
    let formatted = `**${itinerary.title}**\n${itinerary.summary}\n\n`;
    itinerary.days.forEach((day) => {
      formatted += `**Day ${day.day} (${day.date})**\n`;
      day.activities.forEach((activity) => {
        formatted += `${activity.time} - ${activity.name}\n  ${activity.description}\n  📍 ${activity.location}\n\n`;
      });
    });
    return formatted;
  }
}
