'use server';

/**
 * @fileOverview An AI agent that suggests a bid range for truck drivers based on shipment details, distance, and market rates.
 *
 * - suggestBidRange - A function that handles the bid range suggestion process.
 * - SuggestBidRangeInput - The input type for the suggestBidRange function.
 * - SuggestBidRangeOutput - The return type for the suggestBidRange function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getShipmentDetails} from '@/services/truck';

const SuggestBidRangeInputSchema = z.object({
  shipmentId: z.string().describe('The ID of the shipment to bid on.'),
  desiredProfitMargin: z.number().describe('The desired profit margin percentage.'),
});
export type SuggestBidRangeInput = z.infer<typeof SuggestBidRangeInputSchema>;

const SuggestBidRangeOutputSchema = z.object({
  suggestedBidRange: z.object({
    minBid: z.number().describe('The minimum suggested bid amount.'),
    maxBid: z.number().describe('The maximum suggested bid amount.'),
    reasoning: z.string().describe('The reasoning behind the suggested bid range.'),
  }),
});
export type SuggestBidRangeOutput = z.infer<typeof SuggestBidRangeOutputSchema>;

export async function suggestBidRange(input: SuggestBidRangeInput): Promise<SuggestBidRangeOutput> {
  return suggestBidRangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBidRangePrompt',
  input: {
    schema: z.object({
      shipmentId: z.string().describe('The ID of the shipment to bid on.'),
      source: z.string().describe('The source location of the shipment.'),
      destination: z.string().describe('The destination location of the shipment.'),
      scheduledDate: z.string().describe('The scheduled date for transportation.'),
      truckType: z.string().describe('The type of truck required.'),
      additionalDetails: z.string().describe('Additional details about the shipment.'),
      desiredProfitMargin: z.number().describe('The desired profit margin percentage.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedBidRange: z.object({
        minBid: z.number().describe('The minimum suggested bid amount.'),
        maxBid: z.number().describe('The maximum suggested bid amount.'),
        reasoning: z.string().describe('The reasoning behind the suggested bid range. Include factors such as distance, demand, and truck type.'),
      }),
    }),
  },
  prompt: `You are an AI assistant that helps truck drivers determine a competitive bid range for shipments.

Given the following shipment details, consider the distance between the source and destination, the demand for trucks on the scheduled date,
the type of truck required, and any additional details to suggest a bid range that allows the driver to achieve their desired profit margin.

Shipment ID: {{{shipmentId}}}
Source: {{{source}}}
Destination: {{{destination}}}
Scheduled Date: {{{scheduledDate}}}
Truck Type: {{{truckType}}}
Additional Details: {{{additionalDetails}}}
Desired Profit Margin: {{{desiredProfitMargin}}}%

Consider current market rates for similar shipments. Provide a suggested bid range with a minimum and maximum bid amount.
Also, include a brief reasoning for the suggested bid range, mentioning the factors you considered.
`,
});

const suggestBidRangeFlow = ai.defineFlow<
  typeof SuggestBidRangeInputSchema,
  typeof SuggestBidRangeOutputSchema
>(
  {
    name: 'suggestBidRangeFlow',
    inputSchema: SuggestBidRangeInputSchema,
    outputSchema: SuggestBidRangeOutputSchema,
  },
  async input => {
    const shipmentDetails = await getShipmentDetails(input.shipmentId);

    const {output} = await prompt({
      ...input,
      source: shipmentDetails.source,
      destination: shipmentDetails.destination,
      scheduledDate: shipmentDetails.scheduledDate,
      truckType: shipmentDetails.truckType,
      additionalDetails: shipmentDetails.additionalDetails,
    });
    return output!;
  }
);
