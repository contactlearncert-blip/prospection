'use server';

import {
  evaluateProspect,
  type EvaluateProspectInput,
  type EvaluateProspectOutput,
} from '@/ai/flows/automated-prospect-evaluation';
import {
  generatePersonalizedMessage,
  type GeneratePersonalizedMessageInput,
  type GeneratePersonalizedMessageOutput,
} from '@/ai/flows/generate-personalized-messages';


export async function evaluateProspectAction(
  input: EvaluateProspectInput
): Promise<EvaluateProspectOutput> {
  return evaluateProspect(input);
}

export async function generateMessageAction(
  input: GeneratePersonalizedMessageInput
): Promise<GeneratePersonalizedMessageOutput> {
  return generatePersonalizedMessage(input);
}
