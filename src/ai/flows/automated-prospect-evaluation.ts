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

const fetchUrlContent = ai.defineTool(
  {
    name: 'fetchUrlContent',
    description: 'Fetches the clean, human-readable text content of a given URL. Ideal for analyzing websites.',
    inputSchema: z.object({url: z.string().url()}),
    outputSchema: z.string(),
  },
  async ({url}) => {
    try {
      // Using a third-party service to scrape the website reliably.
      const scrapingResponse = await fetch(`https://r.jina.ai/${url}`, {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!scrapingResponse.ok) {
        // Fallback for simple fetch if Jina fails
        const fallbackResponse = await fetch(url);
        if (!fallbackResponse.ok) {
            return `Error: Failed to fetch URL content with status: ${fallbackResponse.statusText}`;
        }
        const text = await fallbackResponse.text();
        // Basic HTML tag stripping
        return text.replace(/<[^>]*>/g, ' ').replace(/\s\s+/g, ' ').trim();
      }

      const jsonData = await scrapingResponse.json();
      return jsonData.data.content;

    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }
);


const EvaluateProspectInputSchema = z.object({
  industry: z.string().describe('The industry of the potential lead.'),
  onlinePresence: z
    .string()
    .describe(
      'A description of the potential lead\'s online presence. This can be a URL to their website or social media, or a text description.'
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
  tools: [fetchUrlContent],
  prompt: `You are an expert sales professional specializing in evaluating potential leads for online service providers.

You will use the provided information to determine if the potential lead is a good fit for an online service provider.

If the online presence information is a URL, use the 'fetchUrlContent' tool to get the content of the website to inform your evaluation.

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
