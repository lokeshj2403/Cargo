// src/app/customer-booking/page.tsx
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
import { Label } from '@/components/ui/label'; // Keep for potential non-RHF labels if needed
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, Clock } from "lucide-react"; // Added Clock icon
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';

// Define Zod schema for validation based on the image
const shipmentSchema = z.object({
  pickupLocation: z.string().min(3, { message: "Pickup location must be at least 3 characters." }),
  deliveryLocation: z.string().min(3, { message: "Delivery location must be at least 3 characters." }),
  pickupDate: z.date({ required_error: "A pickup date is required." }),
  pickupTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:MM)." }).optional(), // Simple HH:MM validation, optional for now
  estimatedDistance: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number({ invalid_type_error: "Distance must be a number." }).positive({ message: "Distance must be positive." })
  ),
  cargoType: z.string().min(1, { message: "Please select a cargo type." }),
  weight: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number({ required_error: "Weight is required.", invalid_type_error: "Weight must be a number." }).positive({ message: "Weight must be positive." })
  ),
  cargoLength: z.preprocess(
    (a) => parseFloat(z.string().parse(a) || "0"), // Allow empty string -> 0
    z.number({ invalid_type_error: "Length must be a number." }).nonnegative({ message: "Length cannot be negative." })
  ).optional(),
  cargoWidth: z.preprocess(
    (a) => parseFloat(z.string().parse(a) || "0"), // Allow empty string -> 0
    z.number({ invalid_type_error: "Width must be a number." }).nonnegative({ message: "Width cannot be negative." })
  ).optional(),
  cargoHeight: z.preprocess(
    (a) => parseFloat(z.string().parse(a) || "0"), // Allow empty string -> 0
    z.number({ invalid_type_error: "Height must be a number." }).nonnegative({ message: "Height cannot be negative." })
  ).optional(),
  additionalRequirements: z.string().max(500, { message: "Requirements cannot exceed 500 characters." }).optional(),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

export default function CustomerBookingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
        pickupLocation: "",
        deliveryLocation: "",
        pickupDate: undefined,
        pickupTime: "",
        estimatedDistance: undefined,
        cargoType: "",
        weight: undefined,
        cargoLength: undefined,
        cargoWidth: undefined,
        cargoHeight: undefined,
        additionalRequirements: "",
    },
  });


  const onSubmit: SubmitHandler<ShipmentFormData> = async (data) => {
    setIsLoading(true);
    console.log('Shipment Data Submitted:', data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

     toast({
       title: "Shipment Posted (Simulated)!",
       description: "Your shipment details have been posted successfully. Drivers will now be notified.",
       variant: "default",
     });
     form.reset();

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto py-12 px-4">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Book a Truck</CardTitle>
            {/* Removed CardDescription as it's not in the image */}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b pb-1">Shipment Details</h3>

                {/* Pickup & Delivery Location */}
                <div className="grid md:grid-cols-2 gap-6">
                   <FormField
                      control={form.control}
                      name="pickupLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter pickup address" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter delivery address" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                {/* Date, Time, Distance */}
                 <div className="grid md:grid-cols-3 gap-6">
                     <FormField
                      control={form.control}
                      name="pickupDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pickup Date</FormLabel>
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
                                      format(field.value, "dd-MM-yyyy") // Format as dd-mm-yyyy
                                    ) : (
                                      <span>dd-mm-yyyy</span>
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
                      name="pickupTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <Input type="time" placeholder="--:--" {...field} disabled={isLoading} className="pr-8" />
                                <Clock className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedDistance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Distance (km)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} min="0" step="any" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>

                 {/* Cargo Type & Weight */}
                 <div className="grid md:grid-cols-2 gap-6">
                     <FormField
                      control={form.control}
                      name="cargoType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo Type</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                             <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cargo type" />
                              </SelectTrigger>
                             </FormControl>
                            <SelectContent>
                              {/* Add relevant cargo types */}
                              <SelectItem value="general">General Cargo</SelectItem>
                              <SelectItem value="perishable">Perishable Goods</SelectItem>
                              <SelectItem value="fragile">Fragile Items</SelectItem>
                              <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                              <SelectItem value="liquid">Liquid Bulk</SelectItem>
                              <SelectItem value="dry_bulk">Dry Bulk</SelectItem>
                              <SelectItem value="vehicles">Vehicles</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} min="0" step="any" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                 </div>

                 {/* Cargo Dimensions */}
                 <div>
                    <Label className='mb-2 block'>Cargo Dimensions</Label>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="cargoLength"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Length (cm)</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="Length (cm)" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} min="0" step="any"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cargoWidth"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Width (cm)</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="Width (cm)" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} min="0" step="any" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cargoHeight"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs text-muted-foreground">Height (cm)</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="Height (cm)" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} min="0" step="any" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                 </div>


                 {/* Additional Requirements */}
                  <FormField
                    control={form.control}
                    name="additionalRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special instructions or requirements..."
                            className="resize-none"
                            {...field}
                             disabled={isLoading}
                          />
                        </FormControl>
                         {/* Optional: Keep character count if desired */}
                         {/* <p className="text-xs text-muted-foreground text-right">{field.value?.length || 0}/500</p> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <Separator />

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

    