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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define Zod schema for validation
const shipmentSchema = z.object({
  source: z.string().min(3, { message: "Source location must be at least 3 characters." }),
  destination: z.string().min(3, { message: "Destination location must be at least 3 characters." }),
  scheduledDate: z.date({ required_error: "A scheduled date is required." }),
  truckType: z.string().min(1, { message: "Please select a truck type." }),
  additionalDetails: z.string().max(500, { message: "Details cannot exceed 500 characters." }).optional(),
  // Add other relevant fields like weight, dimensions, cargo type etc. if needed
  cargoWeight: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number({ invalid_type_error: "Weight must be a number." }).positive({ message: "Weight must be positive." }).optional()
  ),
  cargoType: z.string().optional(),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

export default function CustomerBookingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
        source: "",
        destination: "",
        scheduledDate: undefined,
        truckType: "",
        additionalDetails: "",
        cargoWeight: undefined,
        cargoType: "",
    },
  });


  const onSubmit: SubmitHandler<ShipmentFormData> = async (data) => {
    setIsLoading(true);
    console.log('Shipment Data Submitted:', data);

    // Simulate API call to post shipment details
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Replace with actual API call (e.g., using fetch or axios)
    // const response = await fetch('/api/shipments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });

    // if (response.ok) {
    //    toast({
    //      title: "Shipment Posted!",
    //      description: "Your shipment details have been posted successfully. Drivers will now be notified.",
    //      variant: "default", // Or use a success variant if defined
    //    });
    //    form.reset(); // Reset form on success
    // } else {
    //    toast({
    //      title: "Error Posting Shipment",
    //      description: "There was a problem posting your shipment. Please try again.",
    //      variant: "destructive",
    //    });
    // }

     toast({
       title: "Shipment Posted (Simulated)!",
       description: "Your shipment details have been posted successfully. Drivers will now be notified.",
       variant: "default",
     });
     form.reset(); // Reset form on success

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto py-12 px-4">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Book a Truck</CardTitle>
            <CardDescription>Enter the details of your shipment below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Los Angeles, CA" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., New York, NY" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                 <div className="grid md:grid-cols-2 gap-6">
                     <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Scheduled Date</FormLabel>
                           <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={isLoading}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0)) // Disable past dates
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="truckType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Truck Type</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                             <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select truck type" />
                              </SelectTrigger>
                             </FormControl>
                            <SelectContent>
                              <SelectItem value="dry_van">Dry Van</SelectItem>
                              <SelectItem value="refrigerated">Refrigerated Truck</SelectItem>
                              <SelectItem value="flatbed">Flatbed</SelectItem>
                              <SelectItem value="tanker">Tanker</SelectItem>
                              <SelectItem value="box_truck">Box Truck</SelectItem>
                               <SelectItem value="other">Other (Specify in details)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>

                  <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cargoWeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo Weight (Optional, in lbs/kg)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 5000" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="cargoType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo Type (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Electronics, Produce, Furniture" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>


                  <FormField
                    control={form.control}
                    name="additionalDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific requirements, handling instructions, etc."
                            className="resize-none"
                            {...field}
                             disabled={isLoading}
                          />
                        </FormControl>
                         <p className="text-xs text-muted-foreground text-right">{field.value?.length || 0}/500</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Posting Shipment...' : 'Post Shipment'}
                  </Button>
                </div>
              </form>
             </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
