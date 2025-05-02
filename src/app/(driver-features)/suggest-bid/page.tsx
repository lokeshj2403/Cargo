'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, HelpCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestBidRange, type SuggestBidRangeInput, type SuggestBidRangeOutput } from '@/ai/flows/suggest-bid-range';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const bidSuggestionSchema = z.object({
  shipmentId: z.string().min(1, { message: "Shipment ID is required." }),
  desiredProfitMargin: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number({ required_error: "Profit margin is required.", invalid_type_error: "Profit margin must be a number." })
      .min(0, { message: "Profit margin cannot be negative." })
      .max(100, { message: "Profit margin cannot exceed 100%." })
  ),
});

type BidSuggestionFormData = z.infer<typeof bidSuggestionSchema>;

export default function SuggestBidPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState<SuggestBidRangeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<BidSuggestionFormData>({
    resolver: zodResolver(bidSuggestionSchema),
    defaultValues: {
      shipmentId: "",
      desiredProfitMargin: undefined, // Start empty
    },
  });

  const onSubmit: SubmitHandler<BidSuggestionFormData> = async (data) => {
    setIsLoading(true);
    setSuggestionResult(null);
    setError(null);
    console.log('Requesting Bid Suggestion:', data);

    try {
      // Call the Genkit flow function
      const result = await suggestBidRange(data);
      setSuggestionResult(result);
      toast({
        title: "Bid Suggestion Ready!",
        description: "AI has generated a suggested bid range.",
      });
    } catch (err: any) {
        console.error("Error fetching bid suggestion:", err);
        const errorMessage = err.message || "An unexpected error occurred while fetching the bid suggestion.";
        setError(errorMessage);
        toast({
            title: "Error Getting Suggestion",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-md mx-auto py-12 px-4">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                AI Bid Suggestion Tool
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Enter shipment details to get an AI-powered bid range suggestion.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardTitle>
            <CardDescription>Get help determining a competitive bid for a shipment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="shipmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipment ID</FormLabel>
                       <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 ml-1 inline-block text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>Enter the ID of the shipment you received a notification for.</p>
                              </TooltipContent>
                          </Tooltip>
                       </TooltipProvider>
                      <FormControl>
                        <Input placeholder="Enter the Shipment ID" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desiredProfitMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Profit Margin (%)</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 ml-1 inline-block text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                  <p>Enter the profit percentage you aim to make on this shipment (0-100).</p>
                              </TooltipContent>
                          </Tooltip>
                       </TooltipProvider>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 15" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Getting Suggestion...' : 'Suggest Bid Range'}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Display Suggestion Result or Error */}
             {error && (
                <Alert variant="destructive" className="mt-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {suggestionResult && !error && (
                <Alert variant="default" className="mt-6 bg-accent/10 border-accent">
                    <AlertTitle className="text-lg font-semibold text-primary">Suggested Bid Range</AlertTitle>
                    <AlertDescription className="mt-2 space-y-2">
                        <p className="text-2xl font-bold text-center text-accent">
                            ${suggestionResult.suggestedBidRange.minBid.toFixed(2)} - ${suggestionResult.suggestedBidRange.maxBid.toFixed(2)}
                        </p>
                        <div>
                            <h4 className="font-semibold text-foreground/90">Reasoning:</h4>
                            <p className="text-sm text-foreground/80">{suggestionResult.suggestedBidRange.reasoning}</p>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2">*This is an AI-generated suggestion. Consider all factors before placing your final bid.</p>
                    </AlertDescription>
                </Alert>
            )}

          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
