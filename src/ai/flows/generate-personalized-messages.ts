'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized initial messages for prospects.
 *
 * It includes:
 * - generatePersonalizedMessage - A function that generates a personalized message for a prospect.
 * - GeneratePersonalizedMessageInput - The input type for the generatePersonalizedMessage function.
 * - GeneratePersonalizedMessageOutput - The return type for the generatePersonalizedMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedMessageInputSchema = z.object({
  prospectName: z.string().describe('The name of the prospect.'),
  prospectOnlinePresence: z
    .string()
    .describe(
      'Details about the prospect from their online presence, including their website, social media, etc.'
    ),
  serviceOffering: z.string().describe('Description of the service being offered.'),
});
export type GeneratePersonalizedMessageInput = z.infer<
  typeof GeneratePersonalizedMessageInputSchema
>;

const GeneratePersonalizedMessageOutputSchema = z.object({
  personalizedMessage: z
    .string()
    .describe('A personalized initial message for the prospect.'),
});
export type GeneratePersonalizedMessageOutput = z.infer<
  typeof GeneratePersonalizedMessageOutputSchema
>;

export async function generatePersonalizedMessage(
  input: GeneratePersonalizedMessageInput
): Promise<GeneratePersonalizedMessageOutput> {
  return generatePersonalizedMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedMessagePrompt',
  input: {schema: GeneratePersonalizedMessageInputSchema},
  output: {schema: GeneratePersonalizedMessageOutputSchema},
  prompt: `You are an AI assistant specialized in crafting personalized initial messages for service providers to engage with potential clients. Based on the information about the prospect and the service being offered, generate a compelling and personalized message.

Prospect Name: {{{prospectName}}}
Prospect Online Presence: {{{prospectOnlinePresence}}}
Service Offering: {{{serviceOffering}}}

Personalized Message:`,
});

const generatePersonalizedMessageFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedMessageFlow',
    inputSchema: GeneratePersonalizedMessageInputSchema,
    outputSchema: GeneratePersonalizedMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
