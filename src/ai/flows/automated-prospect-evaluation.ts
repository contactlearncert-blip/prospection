'use server';
/**
 * @fileOverview An AI agent that evaluates potential leads to determine if they are a good fit based on their online presence and industry.
 *
 * - evaluateProspect - A function that evaluates a potential lead.
 * - EvaluateProspectInput - The input type for the evaluateProspect function.
 * - EvaluateProspectOutput - The return type for the evaluateProspect function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateProspectInputSchema = z.object({
  industry: z.string().describe('The industry of the potential lead.'),
  onlinePresence: z
    .string()
    .describe(
      'A description of the potential lead\'s online presence, including website, social media, and other relevant online activities.'
    ),
});
export type EvaluateProspectInput = z.infer<typeof EvaluateProspectInputSchema>;

const EvaluateProspectOutputSchema = z.object({
  isGoodFit: z
    .boolean()
    .describe(
      'Whether the potential lead is a good fit based on their industry and online presence.'
    ),
  reason: z
    .string()
    .describe(
      'The reason why the potential lead is or is not a good fit. If it is a good fit, also provide a brief summary of the lead.'
    ),
});
export type EvaluateProspectOutput = z.infer<typeof EvaluateProspectOutputSchema>;

export async function evaluateProspect(
  input: EvaluateProspectInput
): Promise<EvaluateProspectOutput> {
  return evaluateProspectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateProspectPrompt',
  input: {schema: EvaluateProspectInputSchema},
  output: {schema: EvaluateProspectOutputSchema},
  prompt: `You are an expert sales professional specializing in evaluating potential leads for online service providers.

You will use the provided information to determine if the potential lead is a good fit for an online service provider.

Industry: {{{industry}}}
Online Presence: {{{onlinePresence}}}

Based on this information, determine if the potential lead is a good fit. Set the isGoodFit output field accordingly.
Also provide the reasoning behind your determination in the reason output field. If the potential lead is a good fit, also include a brief summary of the lead.`,
});

const evaluateProspectFlow = ai.defineFlow(
  {
    name: 'evaluateProspectFlow',
    inputSchema: EvaluateProspectInputSchema,
    outputSchema: EvaluateProspectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
