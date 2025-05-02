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
import { Label } from '@/components/ui/label'; // Label is technically not needed if only using RHF FormLabel
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; // Added FormDescription
import { Separator } from '@/components/ui/separator';

// Define Zod schema for validation
const driverSchema = z.object({
  driverName: z.string().min(2, { message: "Driver name must be at least 2 characters." }),
  licenseNumber: z.string().min(5, { message: "License number seems too short." }),
  contactNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." }), // E.164 format-ish
  email: z.string().email({ message: "Invalid email address." }),
  // Placeholder for file uploads - Actual implementation requires backend storage handling
  licenseUpload: z.any().refine(file => file?.length == 1, 'License file is required.').optional(), // Optional for now
});

const truckSchema = z.object({
  licensePlate: z.string().min(3, { message: "License plate seems too short." }),
  make: z.string().min(2, { message: "Truck make is required." }),
  model: z.string().min(1, { message: "Truck model is required." }),
  year: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().min(1980, { message: "Year seems too old." }).max(new Date().getFullYear() + 1, { message: "Year cannot be in the future." })
  ),
  truckType: z.string().min(1, { message: "Please select a truck type." }),
  capacity: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number({ invalid_type_error: "Capacity must be a number." }).positive({ message: "Capacity must be positive." })
  ),
  capacityUnit: z.enum(['lbs', 'kg', 'tons']),
   // Placeholder for file uploads
  documentsUpload: z.any().refine(file => file?.length >= 1, 'At least one truck document is required.').optional(), // Optional for now
});

const registrationSchema = driverSchema.merge(truckSchema);

type RegistrationFormData = z.infer<typeof registrationSchema>;


export default function DriverRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

   const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
     defaultValues: {
      driverName: "",
      licenseNumber: "",
      contactNumber: "",
      email: "",
      licenseUpload: undefined,
      licensePlate: "",
      make: "",
      model: "",
      year: undefined,
      truckType: "",
      capacity: undefined,
      capacityUnit: "lbs",
      documentsUpload: undefined,
    },
  });


  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    setIsLoading(true);
    console.log('Registration Data Submitted:', data);

    // **IMPORTANT:** File handling needs backend integration.
    // The 'data' object here contains FileList objects for uploads.
    // You'd typically use FormData to send this to your backend.
    // Example (conceptual):
    // const formData = new FormData();
    // Object.entries(data).forEach(([key, value]) => {
    //   if (key === 'licenseUpload' || key === 'documentsUpload') {
    //     if (value && value.length > 0) {
    //       formData.append(key, value[0], value[0].name); // Append the file
    //     }
    //   } else {
    //     formData.append(key, String(value)); // Append other fields as strings
    //   }
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Replace with actual API call using FormData
    // try {
    //   const response = await fetch('/api/drivers/register', {
    //     method: 'POST',
    //     body: formData, // Send FormData, not JSON
    //   });
    //   if (response.ok) {
    //      toast({ title: "Registration Successful!", description: "Your details have been submitted for review." });
    //      form.reset();
    //   } else {
    //     const errorData = await response.json();
    //     toast({ title: "Registration Failed", description: errorData.message || "Please check your details and try again.", variant: "destructive" });
    //   }
    // } catch (error) {
    //    toast({ title: "Network Error", description: "Could not submit registration. Please check your connection.", variant: "destructive" });
    // }


      toast({
        title: "Registration Submitted (Simulated)!",
        description: "Your details have been submitted for review.",
      });
      form.reset();

    setIsLoading(false);
  };

  // Helper for file input label
  const getFileName = (fieldValue: any): string => {
    return fieldValue && fieldValue.length > 0 ? fieldValue[0].name : 'No file chosen';
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto py-12 px-4">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Register Your Truck & Driver</CardTitle>
            <CardDescription>Provide your details and your truck's information to join our network.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Driver Details Section */}
                <section className="space-y-6">
                   <h3 className="text-xl font-semibold text-primary border-b pb-2">Driver Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                       <FormField
                        control={form.control}
                        name="driverName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Driver's Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., John Doe" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Driver's License Number</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., D12345678" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     <div className="grid md:grid-cols-2 gap-6">
                       <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Contact Phone Number</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="+15551234567" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="driver@example.com" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    {/* Driver License Upload - Placeholder */}
                    {/* RHF integrated file input - uncomment if using */}
                    {/* <FormField
                      control={form.control}
                      name="licenseUpload"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                         <FormItem>
                           <FormLabel>Upload Driver's License (PDF, JPG, PNG)</FormLabel>
                            <FormControl>
                              <Input
                                {...fieldProps}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) => onChange(event.target.files)}
                                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                disabled={isLoading}
                              />
                           </FormControl>
                           <FormDescription>
                             {getFileName(value)}
                            </FormDescription>
                           <FormMessage />
                         </FormItem>
                       )}
                     /> */}
                     {/* Simple non-RHF file input placeholder */}
                     <FormItem>
                           <FormLabel>Upload Driver's License (PDF, JPG, PNG)</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                disabled={isLoading}
                              />
                           </FormControl>
                           <FormDescription>
                             File upload functionality requires backend integration.
                            </FormDescription>
                           {/* <FormMessage /> */} {/* Error display needs RHF integration for file inputs */}
                         </FormItem>

                </section>

                 <Separator />

                {/* Truck Details Section */}
                <section className="space-y-6">
                     <h3 className="text-xl font-semibold text-primary border-b pb-2">Truck Information</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                       <FormField
                        control={form.control}
                        name="licensePlate"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>License Plate</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., TRUCK123" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Freightliner, Volvo" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Cascadia, VNL" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     <div className="grid md:grid-cols-3 gap-6">
                        <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 2020" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} />
                            </FormControl>
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
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-2">
                             <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Capacity</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 45000" {...field} onChange={event => field.onChange(+event.target.value)} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                             <FormField
                                control={form.control}
                                name="capacityUnit"
                                render={({ field }) => (
                                    <FormItem className='self-end'>
                                    {/* <FormLabel>Unit</FormLabel> */} {/* Label hidden for better layout */}
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="lbs">lbs</SelectItem>
                                        <SelectItem value="kg">kg</SelectItem>
                                        <SelectItem value="tons">tons</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>

                    </div>
                      {/* Truck Documents Upload - Placeholder */}
                     {/* RHF integrated file input - uncomment if using */}
                     {/* <FormField
                      control={form.control}
                      name="documentsUpload"
                       render={({ field: { value, onChange, ...fieldProps } }) => (
                         <FormItem>
                           <FormLabel>Upload Truck Documents (Registration, Insurance, etc.)</FormLabel>
                            <FormControl>
                              <Input
                                 {...fieldProps}
                                type="file"
                                multiple // Allow multiple file uploads
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) => onChange(event.target.files)}
                                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                disabled={isLoading}
                              />
                            </FormControl>
                             <FormDescription>
                             {value && value.length > 0 ? `${value.length} file(s) selected` : 'No files chosen'}
                            </FormDescription>
                           <FormMessage />
                         </FormItem>
                       )}
                     /> */}
                      {/* Simple non-RHF file input placeholder */}
                     <FormItem>
                           <FormLabel>Upload Truck Documents (Registration, Insurance, etc.)</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                disabled={isLoading}
                              />
                           </FormControl>
                           <FormDescription>
                             File upload functionality requires backend integration.
                            </FormDescription>
                            {/* <FormMessage /> */} {/* Error display needs RHF integration for file inputs */}
                         </FormItem>
                </section>

                <div className="flex justify-end pt-6">
                  <Button type="submit" disabled={isLoading}>
                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     {isLoading ? 'Submitting Registration...' : 'Register Truck'}
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

